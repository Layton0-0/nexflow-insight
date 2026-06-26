import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PicksScreen } from "@/components/nexflow/picks";
import { krPicks } from "@/lib/mock-market-screens";

export const Route = createFileRoute("/picks/kr")({
  head: () => ({ meta: [{ title: "국내장 투자 후보 — NEXFLOW" }] }),
  component: () => (
    <AppShell>
      <PicksScreen page={krPicks} title="국내장 투자 후보" />
    </AppShell>
  ),
});