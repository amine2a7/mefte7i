"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Car, Home, Loader2, Search, ShieldAlert, ShieldCheck, Siren, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { demandeTitle } from "@/lib/labels";
import { formatMontant } from "@/lib/constants";
import {
  searchDemandesByPhoneAction,
  clientValidateDemandeAction,
  clientDisputeAction,
  type SuiviDemande,
} from "@/app/actions/suivi";

export function SuiviSearch() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SuiviDemande[] | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await searchDemandesByPhoneAction(phone);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setResults(result.data);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="tel"
          placeholder="Votre numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 flex-1"
          required
        />
        <Button type="submit" disabled={loading} className="h-12 rounded-xl px-6">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Rechercher
        </Button>
      </form>

      {results !== null && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
              Aucune demande trouvée pour ce numéro.
            </p>
          ) : (
            results.map((d) => <DemandeCard key={d.id} demande={d} phone={phone} />)
          )}
        </div>
      )}
    </div>
  );
}

function DemandeCard({ demande, phone }: { demande: SuiviDemande; phone: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="flex w-full items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {demande.kind === "INCIDENT" ? <Siren className="size-5" /> : <ShoppingBag className="size-5" />}
          </div>
          <div>
            <p className="font-medium">{demandeTitle(demande)}</p>
            <p className="text-xs text-muted-foreground">
              {demande.bienType === "VOITURE" ? <Car className="inline size-3.5" /> : <Home className="inline size-3.5" />}{" "}
              {format(demande.createdAt, "d MMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {demande.clientDispute && (
            <ShieldAlert className="size-4 text-destructive" aria-label="Litige signalé" />
          )}
          <StatusBadge status={demande.status} />
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-border/60 pt-4">
          <div className="text-sm">
            <p className="text-muted-foreground">Montant</p>
            <p className="font-medium">{demande.montant != null ? formatMontant(demande.montant) : "Pas encore fixé"}</p>
          </div>

          {demande.status === "REJETE" && demande.raisonRejet && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Raison du rejet : {demande.raisonRejet}
            </p>
          )}

          {demande.clientDispute && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Un signalement est en cours d&apos;examen par notre équipe pour cette demande.
            </p>
          )}

          {demande.status === "EN_COURS" && demande.montant != null && !demande.clientDispute && (
            <ConfirmServiceForm demandeId={demande.id} phone={phone} montantAgent={demande.montant} />
          )}

          {!demande.clientDispute && <DisputeForm demandeId={demande.id} phone={phone} /> }
        </div>
      )}
    </div>
  );
}

function ConfirmServiceForm({
  demandeId,
  phone,
  montantAgent,
}: {
  demandeId: string;
  phone: string;
  montantAgent: number;
}) {
  const [code, setCode] = useState("");
  const [montant, setMontant] = useState(montantAgent.toString());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    const result = await clientValidateDemandeAction(demandeId, phone, code, parseFloat(montant));
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    if (result.data.validated) {
      toast.success("Merci ! Votre confirmation a été enregistrée.");
      setDone(true);
    } else {
      toast.warning("Le montant ne correspond pas — un responsable va vérifier votre déclaration.");
      setDone(true);
    }
  }

  if (done) {
    return (
      <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400">
        Confirmation enregistrée, merci.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ShieldCheck className="size-4 text-primary" />
        Confirmer le service et le paiement
      </div>
      <p className="text-xs text-muted-foreground">
        Confirmez que l&apos;intervention a bien été effectuée et le montant que vous avez payé, à
        l&apos;aide du code reçu lors de votre demande.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="confirm-code">Code de confirmation</Label>
          <Input id="confirm-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex : A3F9K2" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-montant">Montant payé</Label>
          <Input id="confirm-montant" type="number" step="0.001" value={montant} onChange={(e) => setMontant(e.target.value)} className="h-11" />
        </div>
      </div>
      <Button disabled={loading || !code || !montant} onClick={handleConfirm} className="w-full rounded-xl">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        Confirmer
      </Button>
    </div>
  );
}

function DisputeForm({ demandeId, phone }: { demandeId: string; phone: string }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const result = await clientDisputeAction(demandeId, phone, code, note);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Signalement envoyé, merci.");
    setDone(true);
  }

  if (done) {
    return <p className="text-xs text-muted-foreground">Signalement transmis à notre équipe.</p>;
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-muted-foreground underline hover:text-foreground">
        Ce statut ne correspond pas à ce qui s&apos;est passé ? Signaler un problème
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-destructive">
        <ShieldAlert className="size-4" />
        Signaler un problème
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dispute-code">Code de confirmation</Label>
        <Input id="dispute-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex : A3F9K2" className="h-11" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dispute-note">Expliquez le problème</Label>
        <Textarea id="dispute-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
      </div>
      <Button
        variant="destructive"
        disabled={loading || !code || note.trim().length < 5}
        onClick={handleSubmit}
        className="w-full rounded-xl"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldAlert className="size-4" />}
        Envoyer le signalement
      </Button>
    </div>
  );
}
