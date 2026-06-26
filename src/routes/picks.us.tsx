import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PicksScreen } from "@/components/nexflow/picks";
import { usPicks } from "@/lib/mock-market-screens";

export const Route = createFileRoute("/picks/us")({
  head: () => ({ meta: [{ title: "미국장 투자 후보 — NEXFLOW" }] }),
  component: () => (
    <AppShell>
      <PicksScreen page={usPicks} title="미국장 투자 후보" />
    </AppShell>
  ),
});