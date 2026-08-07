import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api";
import { AppShell } from "@/components/app/shell";
import { Button, EmptyState, Sheet } from "@/components/ui";
import Dashboard from "@/pages/dashboard";
import Report from "@/pages/report";
import Shared from "@/pages/shared";
import Rubric from "@/pages/rubric";
import System from "@/pages/system";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        {/* The public report renders outside the app shell on purpose. */}
        <Route path="/r/:token" component={Shared} />

        <Route>
          <AppShell>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/audit/:id" component={Report} />
              <Route path="/rubric" component={Rubric} />
              <Route path="/system" component={System} />
              <Route component={NotFound} />
            </Switch>
          </AppShell>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}

function NotFound() {
  return (
    <Sheet>
      <EmptyState
        title="Nothing here"
        action={
          <a href="/">
            <Button size="sm">Back to the index</Button>
          </a>
        }
      >
        That page does not exist.
      </EmptyState>
    </Sheet>
  );
}
