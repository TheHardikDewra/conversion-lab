import * as React from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Link2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Button, EmptyState, Sheet, Skeleton } from "@/components/ui";
import { ReportView } from "@/components/app/report-view";

export default function Report() {
  const [, params] = useRoute("/audit/:id");
  const id = params?.id ?? "";

  const { data: audit, isLoading, isError } = useQuery({
    queryKey: ["audit", id],
    queryFn: () => api.audit(id),
    enabled: !!id,
  });

  if (isLoading) return <ReportSkeleton />;

  if (isError || !audit) {
    return (
      <Sheet>
        <EmptyState
          title="No such report"
          action={
            <Link href="/">
              <Button size="sm">Back to the index</Button>
            </Link>
          }
        >
          It may have been deleted, or the link may be wrong.
        </EmptyState>
      </Sheet>
    );
  }

  return (
    <>
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-ink-subtle transition-colors duration-fast ease-ease hover:text-ink"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={2} />
        Index
      </Link>
      <ReportView audit={audit} actions={<ShareButton token={audit.shareToken} />} />
    </>
  );
}

function ShareButton({ token }: { token: string }) {
  const [copied, setCopied] = React.useState(false);

  const share = async () => {
    const url = `${window.location.origin}/r/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this report link", url);
    }
  };

  return (
    <Button size="sm" variant={copied ? "secondary" : "primary"} onClick={share}>
      {copied ? (
        <>
          <Check className="h-3 w-3" strokeWidth={2.5} />
          Link copied
        </>
      ) : (
        <>
          <Link2 className="h-3 w-3" strokeWidth={1.75} />
          Share report
        </>
      )}
    </Button>
  );
}

function ReportSkeleton() {
  return (
    <>
      <Skeleton className="mb-8 h-3 w-16" />
      <Skeleton className="mb-4 h-3 w-56" />
      <Skeleton className="mb-10 h-14 w-2/3" />
      <Skeleton className="mb-12 h-32 w-full" />
      <div className="grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-[30rem] w-full" />
      </div>
    </>
  );
}
