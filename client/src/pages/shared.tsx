import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { ReportView } from "@/components/app/report-view";
import { Wordmark } from "@/components/app/shell";

/**
 * The public face of a report. No navigation rail, no run bar, no delete - * a share link should read as a document, not as somebody else's dashboard.
 */
export default function Shared() {
  const [, params] = useRoute("/r/:token");
  const token = params?.token ?? "";

  const { data: audit, isLoading, isError } = useQuery({
    queryKey: ["shared", token],
    queryFn: () => api.shared(token),
    enabled: !!token,
  });

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-shell items-center justify-between px-4 py-3 lg:px-8">
          <Wordmark />
          <Link href="/">
            <Button size="sm" variant="secondary">
              Audit your own page
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-4 py-8 lg:px-8">
        {isLoading ? (
          <>
            <Skeleton className="mb-6 h-52 w-full" />
            <Skeleton className="h-96 w-full" />
          </>
        ) : isError || !audit ? (
          <Card>
            <EmptyState title="This report link is not valid">
              It may have expired, or the audit behind it was deleted.
            </EmptyState>
          </Card>
        ) : (
          <ReportView audit={audit} publicView />
        )}
      </main>
    </div>
  );
}
