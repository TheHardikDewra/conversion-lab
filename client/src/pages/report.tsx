import * as React from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Link2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Button, Card, EmptyState, Skeleton } from "@/components/ui";
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
      <Card>
        <EmptyState
          title="That audit does not exist"
          action={
            <Link href="/">
              <Button size="sm">Back to audits</Button>
            </Link>
          }
        >
          It may have been deleted, or the link may be wrong.
        </EmptyState>
      </Card>
    );
  }

  return (
    <>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle transition-colors duration-fast ease-ease hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        All audits
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
          <Link2 className="h-3 w-3" strokeWidth={2} />
          Copy share link
        </>
      )}
    </Button>
  );
}

function ReportSkeleton() {
  return (
    <>
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-6 h-52 w-full" />
      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </>
  );
}
