import { QueryClient } from "@tanstack/react-query";
import type { Audit, CategoryKey, Weights } from "@shared/schema";

export type AppConfig = {
  aiEnabled: boolean;
  storage: "memory" | "postgres";
  ruleCount: number;
  categories: {
    key: CategoryKey;
    label: string;
    blurb: string;
    defaultWeight: number;
  }[];
  defaultWeights: Weights;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly hint?: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { "content-type": "application/json" } : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    let hint: string | undefined;
    try {
      const body = await res.json();
      message = body.message ?? message;
      hint = body.hint;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(message, hint, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  config: () => request<AppConfig>("/api/config"),
  audits: () => request<Audit[]>("/api/audits"),
  audit: (id: string) => request<Audit>(`/api/audits/${id}`),
  shared: (token: string) => request<Audit>(`/api/shared/${token}`),
  runAudit: (url: string) =>
    request<Audit>("/api/audits", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),
  deleteAudit: (id: string) =>
    request<void>(`/api/audits/${id}`, { method: "DELETE" }),
  rubric: () => request<{ weights: Weights; defaults: Weights }>("/api/rubric"),
  saveRubric: (weights: Weights) =>
    request<{ weights: Weights; rescored: number }>("/api/rubric", {
      method: "PUT",
      body: JSON.stringify({ weights }),
    }),
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, error) => {
        // A 404 or a rejected URL will not fix itself on retry.
        if (error instanceof ApiError && error.status && error.status < 500) {
          return false;
        }
        return count < 1;
      },
      staleTime: 30_000,
    },
  },
});
