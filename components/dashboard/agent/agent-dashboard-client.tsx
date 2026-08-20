"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown, Car, Home, ShoppingBag, Siren } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgenceBadge } from "@/components/dashboard/badges";
import { DemandeDetailSheet } from "@/components/dashboard/agent/demande-detail-sheet";
import { demandeTitle } from "@/lib/labels";
import { formatMontant } from "@/lib/constants";
import type { DemandeWithRelations } from "@/lib/types";

const URGENCE_PRIORITY: Record<string, number> = { TRES_URGENT: 0, URGENT: 1, NORMAL: 2 };

export function AgentDashboardClient({ demandes }: { demandes: DemandeWithRelations[] }) {
  const [selected, setSelected] = useState<DemandeWithRelations | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("TOUS");
  const [bienFilter, setBienFilter] = useState<string>("TOUS");
  const [urgenceFilter, setUrgenceFilter] = useState<string>("TOUS");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);

  const pendingCount = demandes.filter((d) => d.status === "EN_ATTENTE").length;

  const taches = useMemo(
    () =>
      demandes
        .filter((d) => d.status === "EN_ATTENTE" && (d.urgence === "URGENT" || d.urgence === "TRES_URGENT"))
        .sort((a, b) => URGENCE_PRIORITY[a.urgence] - URGENCE_PRIORITY[b.urgence] || a.createdAt.getTime() - b.createdAt.getTime()),
    [demandes],
  );

  const filtered = useMemo(
    () =>
      demandes.filter(
        (d) =>
          (statusFilter === "TOUS" || d.status === statusFilter) &&
          (bienFilter === "TOUS" || d.bienType === bienFilter) &&
          (urgenceFilter === "TOUS" || d.urgence === urgenceFilter),
      ),
    [demandes, statusFilter, bienFilter, urgenceFilter],
  );

  const columns = useMemo<ColumnDef<DemandeWithRelations>[]>(
    () => [
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.kind === "INCIDENT" ? (
              <Siren className="size-4 text-destructive" />
            ) : (
              <ShoppingBag className="size-4 text-primary" />
            )}
            {row.original.bienType === "VOITURE" ? (
              <Car className="size-4 text-muted-foreground" />
            ) : (
              <Home className="size-4 text-muted-foreground" />
            )}
          </div>
        ),
      },
      {
        id: "titre",
        header: "Demande",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{demandeTitle(row.original)}</p>
            <p className="text-xs text-muted-foreground">{row.original.nomContact}</p>
          </div>
        ),
      },
      {
        id: "urgence",
        header: "Urgence",
        cell: ({ row }) =>
          row.original.kind === "INCIDENT" ? <UrgenceBadge urgence={row.original.urgence} /> : <span className="text-muted-foreground">—</span>,
      },
      {
        id: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "montant",
        header: "Montant",
        cell: ({ row }) => (row.original.montant != null ? formatMontant(row.original.montant) : "—"),
      },
      {
        id: "createdAt",
        accessorFn: (row) => row.createdAt.getTime(),
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date <ArrowUpDown className="size-3.5" />
          </button>
        ),
        cell: ({ row }) => format(row.original.createdAt, "d MMM yyyy", { locale: fr }),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="toutes">
        <TabsList>
          <TabsTrigger value="toutes">Toutes les demandes</TabsTrigger>
          <TabsTrigger value="taches">
            Mes tâches du jour
            {taches.length > 0 && (
              <span className="ml-1.5 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] text-white">
                {taches.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="toutes" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "TOUS")}>
              <SelectTrigger className="h-10 w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TOUS">Tous les statuts</SelectItem>
                <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                <SelectItem value="EN_COURS">En cours</SelectItem>
                <SelectItem value="VALIDE">Validé</SelectItem>
                <SelectItem value="REJETE">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bienFilter} onValueChange={(v) => setBienFilter(v ?? "TOUS")}>
              <SelectTrigger className="h-10 w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TOUS">Tous les biens</SelectItem>
                <SelectItem value="VOITURE">Voiture</SelectItem>
                <SelectItem value="MAISON">Maison</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgenceFilter} onValueChange={(v) => setUrgenceFilter(v ?? "TOUS")}>
              <SelectTrigger className="h-10 w-40"><SelectValue placeholder="Urgence" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TOUS">Toutes urgences</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="TRES_URGENT">Très urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      Aucune demande ne correspond aux filtres.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="taches" className="space-y-3">
          {taches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
              Aucune tâche urgente en attente. Bien joué !
            </p>
          ) : (
            taches.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <Siren className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{demandeTitle(d)}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.nomContact} · {d.telephoneContact}
                    </p>
                  </div>
                </div>
                <UrgenceBadge urgence={d.urgence} />
              </button>
            ))
          )}
        </TabsContent>
      </Tabs>

      <DemandeDetailSheet demande={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />

      {pendingCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {pendingCount} demande{pendingCount > 1 ? "s" : ""} en attente de traitement.
        </p>
      )}
    </div>
  );
}
