"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AddAgentDialog } from "@/components/dashboard/admin/add-agent-dialog";
import { toggleAgentActiveAction } from "@/app/actions/agents";

export type AgentRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  traitees: number;
  validees: number;
  tauxValidation: number;
};

export function AgentsManagement({ agents }: { agents: AgentRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(agent: AgentRow) {
    setPendingId(agent.id);
    startTransition(async () => {
      const result = await toggleAgentActiveAction(agent.id);
      setPendingId(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(agent.active ? "Agent désactivé" : "Agent réactivé");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{agents.length} agent(s)</p>
        <AddAgentDialog />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Traitées</TableHead>
              <TableHead className="text-right">Validées</TableHead>
              <TableHead className="text-right">Taux</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucun agent pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent.email}
                    {agent.phone && <div className="text-xs">{agent.phone}</div>}
                  </TableCell>
                  <TableCell className="text-right">{agent.traitees}</TableCell>
                  <TableCell className="text-right">{agent.validees}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{agent.tauxValidation}%</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={agent.active}
                        disabled={pendingId === agent.id}
                        onCheckedChange={() => handleToggle(agent)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {agent.active ? "Actif" : "Désactivé"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
