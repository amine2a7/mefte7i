import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllDemandesWithRelations } from "@/lib/demandes-repo";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { AgentDashboardClient } from "@/components/dashboard/agent/agent-dashboard-client";

export default async function AgentDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "AGENT") redirect("/login?next=/agent/dashboard");

  const demandes = await getAllDemandesWithRelations();

  const pendingCount = demandes.filter((d) => d.status === "EN_ATTENTE").length;

  return (
    <>
      <DashboardTopbar
        role="AGENT"
        userName={session.name}
        userEmail={session.email}
        actions={
          pendingCount > 0 ? (
            <span className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:flex">
              {pendingCount} nouvelle{pendingCount > 1 ? "s" : ""} demande{pendingCount > 1 ? "s" : ""}
            </span>
          ) : undefined
        }
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord agent</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Traitez les demandes clients : confirmation, montant, validation ou rejet.
          </p>
        </div>

        <div className="mt-8">
          <AgentDashboardClient demandes={demandes} />
        </div>
      </main>
    </>
  );
}
