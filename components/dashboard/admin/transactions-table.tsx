"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COMMISSION_RATE, formatMontant } from "@/lib/constants";
import { demandeTitle } from "@/lib/labels";
import { getValidationDate } from "@/lib/analytics";
import type { DemandeWithRelations } from "@/lib/types";

export function TransactionsTable({ demandes }: { demandes: DemandeWithRelations[] }) {
  const rows = useMemo(
    () =>
      demandes
        .filter((d) => d.status === "VALIDE" && d.montant != null)
        .map((d) => {
          const montant = d.montant ?? 0;
          const commission = montant * COMMISSION_RATE;
          return {
            id: d.id,
            date: getValidationDate(d) ?? d.updatedAt,
            client: d.nomContact,
            agent: d.agent?.name ?? "—",
            titre: demandeTitle(d),
            kind: d.kind,
            montant,
            commission,
            net: montant - commission,
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [demandes],
  );

  function exportCsv() {
    const header = ["Date", "Client", "Agent", "Demande", "Type", "Montant (DT)", "Commission 10% (DT)", "Net entreprise (DT)"];
    const lines = rows.map((r) =>
      [
        format(r.date, "yyyy-MM-dd HH:mm"),
        r.client,
        r.agent,
        r.titre,
        r.kind === "INCIDENT" ? "Incident" : "Commande",
        r.montant.toFixed(3),
        r.commission.toFixed(3),
        r.net.toFixed(3),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mefte7i-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalMontant = rows.reduce((s, r) => s + r.montant, 0);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} transaction(s) validée(s)</p>
        <Button variant="outline" size="sm" onClick={exportCsv} className="rounded-xl">
          <Download className="size-4" />
          Exporter en CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Demande</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Commission (10%)</TableHead>
              <TableHead className="text-right">Net entreprise</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucune transaction validée pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{format(r.date, "d MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell>{r.client}</TableCell>
                  <TableCell>{r.agent}</TableCell>
                  <TableCell>{r.titre}</TableCell>
                  <TableCell className="text-right">{formatMontant(r.montant)}</TableCell>
                  <TableCell className="text-right text-primary">{formatMontant(r.commission)}</TableCell>
                  <TableCell className="text-right">{formatMontant(r.net)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {rows.length > 0 && (
            <tfoot>
              <TableRow>
                <TableCell colSpan={4} className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">{formatMontant(totalMontant)}</TableCell>
                <TableCell className="text-right font-medium text-primary">{formatMontant(totalCommission)}</TableCell>
                <TableCell className="text-right font-medium">{formatMontant(totalMontant - totalCommission)}</TableCell>
              </TableRow>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
}
