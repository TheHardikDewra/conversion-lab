import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button, EmptyState, Sheet, Skeleton } from "@/components/ui";
import { ReportView } from "@/components/app/report-view";
import { Wordmark } from "@/components/app/shell";

/**
 * The public face of a report. No navigation, no run bar, no delete. A share
 * link should read as a document somebody sent you, not as a login screen to
 * somebody else's dashboard.
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
      <header className="rule-b">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-5 lg:px-10">
          <Link href="/">
            <Wordmark compact />
          </Link>
          <Link href="/">
            <Button size="sm" variant="secondary">
              Audit your own page
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 py-12 lg:px-10">
        {isLoading ? (
          <>
            <Skeleton className="mb-10 h-14 w-2/3" />
            <Skeleton className="h-[30rem] w-full" />
          </>
        ) : isError || !audit ? (
          <Sheet>
            <EmptyState title="This link is not valid">
              It may have expired, or the audit behind it was deleted.
            </EmptyState>
          </Sheet>
        ) : (
          <ReportView audit={audit} publicView />
        )}
      </main>
    </div>
  );
}
