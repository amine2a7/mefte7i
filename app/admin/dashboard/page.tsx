import { redirect } from "next/navigation";
import {
  ClipboardList,
  Clock,
  Users,
  CircleCheck,
  CircleX,
  Wallet,
  Percent,
  ShoppingBasket,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { formatMontant } from "@/lib/constants";
import { query, mapUser } from "@/lib/db";
import { getAllDemandesWithRelations } from "@/lib/demandes-repo";
import {
  computeAgentPerformance,
  computeDailyRevenue,
  computeKpis,
  computeSplitByBien,
  computeSplitByKind,
} from "@/lib/analytics";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/dashboard/admin/kpi-card";
import { RevenueChart } from "@/components/dashboard/admin/revenue-chart";
import { SplitChart } from "@/components/dashboard/admin/split-chart";
import { AgentPerformanceChart } from "@/components/dashboard/admin/agent-performance-chart";
import { TransactionsTable } from "@/components/dashboard/admin/transactions-table";
import { AgentsManagement } from "@/components/dashboard/admin/agents-management";
import { AgentDashboardClient } from "@/components/dashboard/agent/agent-dashboard-client";
import { DeleteDemandesDialog } from "@/components/dashboard/admin/delete-demandes-dialog";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login?next=/admin/dashboard");

  const [demandes, agentRowsRaw] = await Promise.all([
    getAllDemandesWithRelations(),
    query("SELECT * FROM users WHERE role = 'AGENT' ORDER BY created_at ASC"),
  ]);
  const agentUsers = agentRowsRaw.map(mapUser);

  const kpis = computeKpis(demandes);
  const dailyRevenue = computeDailyRevenue(demandes, 30);
  const splitByBien = computeSplitByBien(demandes);
  const splitByKind = computeSplitByKind(demandes);
  const agentPerformance = computeAgentPerformance(demandes, agentUsers);

  const agentRows = agentUsers.map((agent, i) => ({
    id: agent.id,
    name: agent.name,
    email: agent.email,
    phone: agent.phone,
    active: agent.active,
    traitees: agentPerformance[i]?.traitees ?? 0,
    validees: agentPerformance[i]?.validees ?? 0,
    tauxValidation: agentPerformance[i]?.tauxValidation ?? 0,
  }));

  return (
    <>
      <DashboardTopbar role="ADMIN" userName={session.name} userEmail={session.email} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vue globale de l&apos;activité, des revenus et de la commission de la plateforme.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total demandes" value={String(kpis.totalDemandes)} sub={`${kpis.totalIncidents} incidents · ${kpis.totalCommandes} commandes`} icon={ClipboardList} accent="primary" />
          <KpiCard label="En attente / en cours" value={`${kpis.enAttente} / ${kpis.enCours}`} icon={Clock} accent="accent" />
          <KpiCard label="Validées" value={String(kpis.valideesCount)} icon={CircleCheck} accent="emerald" />
          <KpiCard label="Rejetées" value={String(kpis.rejetees)} icon={CircleX} accent="destructive" />
          <KpiCard label="Chiffre d'affaires" value={formatMontant(kpis.chiffreAffaires)} sub="Somme des demandes validées" icon={Wallet} accent="primary" />
          <KpiCard
            label="Commission plateforme (10%)"
            value={formatMontant(kpis.commission)}
            sub={`Jour : ${formatMontant(kpis.commissionJour)} · Semaine : ${formatMontant(kpis.commissionSemaine)} · Mois : ${formatMontant(kpis.commissionMois)}`}
            icon={Percent}
            accent="accent"
          />
          <KpiCard label="Panier moyen" value={formatMontant(kpis.panierMoyen)} icon={ShoppingBasket} accent="emerald" />
          <KpiCard label="Agents actifs" value={String(agentRows.filter((a) => a.active).length)} sub={`${agentRows.length} au total`} icon={Users} accent="primary" />
        </div>

        <div className="mt-8">
          <Tabs defaultValue="apercu">
            <TabsList>
              <TabsTrigger value="apercu">Vue d&apos;ensemble</TabsTrigger>
              <TabsTrigger value="demandes">Demandes</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
            </TabsList>

            <TabsContent value="apercu" className="space-y-6">
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
                <h2 className="text-sm font-semibold">Chiffre d&apos;affaires & commission (30 derniers jours)</h2>
                <div className="mt-4">
                  <RevenueChart data={dailyRevenue} />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
                  <SplitChart data={splitByBien} title="Répartition par bien" />
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
                  <SplitChart data={splitByKind} title="Répartition par type de demande" />
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
                <h2 className="text-sm font-semibold">Performance par agent</h2>
                <div className="mt-4">
                  <AgentPerformanceChart data={agentPerformance} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="demandes" className="space-y-4">
              <div className="flex justify-end">
                <DeleteDemandesDialog />
              </div>
              <AgentDashboardClient demandes={demandes} viewerRole="ADMIN" />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionsTable demandes={demandes} />
            </TabsContent>

            <TabsContent value="agents">
              <AgentsManagement agents={agentRows} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
