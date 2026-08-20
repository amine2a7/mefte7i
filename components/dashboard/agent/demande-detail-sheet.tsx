"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
  Car,
  CheckCircle2,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgenceBadge, BienTypeBadge } from "@/components/dashboard/badges";
import { demandeTitle, modeLivraisonLabel } from "@/lib/labels";
import { parsePhotos, type DemandeWithRelations } from "@/lib/types";
import { CURRENCY_SYMBOL, formatMontant } from "@/lib/constants";
import {
  markEnCoursAction,
  rejectDemandeAction,
  setMontantAction,
  validateDemandeAction,
} from "@/app/actions/demandes";

export function DemandeDetailSheet({
  demande,
  open,
  onOpenChange,
}: {
  demande: DemandeWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [montant, setMontant] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [raison, setRaison] = useState("");

  if (!demande) return null;

  async function run(fn: () => Promise<{ success: boolean; error?: string }>) {
    setLoading(true);
    const result = await fn();
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Demande mise à jour");
    router.refresh();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {demande.bienType === "VOITURE" ? <Car className="size-4" /> : <Home className="size-4" />}
            {demandeTitle(demande)}
          </SheetTitle>
          <SheetDescription>
            {demande.kind === "INCIDENT" ? "Incident" : "Commande"} déposé le{" "}
            {format(demande.createdAt, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={demande.status} />
            <BienTypeBadge bienType={demande.bienType} />
            {demande.kind === "INCIDENT" && <UrgenceBadge urgence={demande.urgence} />}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 space-y-3">
            <p className="text-sm font-medium">Client</p>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2">
                <User className="size-3.5 text-muted-foreground" /> {demande.nomContact}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 text-muted-foreground" /> {demande.telephoneContact}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 text-muted-foreground" /> {demande.emailContact}
              </p>
              {demande.adresseIntervention && (
                <p className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-muted-foreground" /> {demande.adresseIntervention}
                </p>
              )}
              {demande.latitude != null && demande.longitude != null && (
                <a
                  href={`https://www.google.com/maps?q=${demande.latitude},${demande.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <MapPin className="size-3.5" />
                  Voir sur la carte
                </a>
              )}
            </div>
          </div>

          {demande.kind === "INCIDENT" ? (
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Description</p>
              <p>{demande.description}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Programmation</p>
                <p>{demande.avecProgrammation ? "Oui" : "Non"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantité</p>
                <p>{demande.quantite}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Mode</p>
                <p>{modeLivraisonLabel(demande.modeLivraison)} — {demande.adresseLivraison}</p>
              </div>
            </div>
          )}

          {parsePhotos(demande.photos).length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Photos</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {parsePhotos(demande.photos).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" className="aspect-square rounded-lg object-cover" />
                ))}
              </div>
            </div>
          )}

          <Separator />

          {demande.status !== "VALIDE" && demande.status !== "REJETE" && (
            <div className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4">
              <p className="text-sm font-medium">Actions</p>

              {demande.status === "EN_ATTENTE" && (
                <Button
                  disabled={loading}
                  onClick={() => run(() => markEnCoursAction(demande.id))}
                  className="w-full rounded-xl"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  Marquer en cours (client contacté)
                </Button>
              )}

              {demande.status === "EN_COURS" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="montant">Montant de l&apos;intervention ({CURRENCY_SYMBOL})</Label>
                    <div className="flex gap-2">
                      <Input
                        id="montant"
                        type="number"
                        min={0}
                        step="0.001"
                        placeholder={demande.montant?.toString() ?? "Ex : 89.000"}
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        className="h-11"
                      />
                      <Button
                        variant="outline"
                        disabled={loading || !montant}
                        onClick={() => run(() => setMontantAction(demande.id, parseFloat(montant)))}
                        className="h-11 shrink-0 rounded-xl"
                      >
                        Enregistrer
                      </Button>
                    </div>
                    {demande.montant != null && (
                      <p className="text-xs text-muted-foreground">
                        Montant actuel : {formatMontant(demande.montant)}
                      </p>
                    )}
                  </div>

                  <Button
                    disabled={loading || demande.montant == null}
                    onClick={() => run(() => validateDemandeAction(demande.id))}
                    className="w-full rounded-xl"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                    Valider (intervention terminée et payée)
                  </Button>
                </>
              )}

              {!rejecting ? (
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={() => setRejecting(true)}
                  className="w-full rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <XCircle className="size-4" />
                  Rejeter la demande
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="raison">Raison du rejet *</Label>
                  <Textarea
                    id="raison"
                    value={raison}
                    onChange={(e) => setRaison(e.target.value)}
                    placeholder="Expliquez pourquoi cette demande est rejetée..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setRejecting(false)} className="rounded-xl">
                      Annuler
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={loading || raison.trim().length < 5}
                      onClick={() => run(() => rejectDemandeAction(demande.id, raison))}
                      className="flex-1 rounded-xl"
                    >
                      Confirmer le rejet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {demande.status === "REJETE" && demande.raisonRejet && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Raison du rejet : {demande.raisonRejet}
            </div>
          )}

          <div>
            <p className="text-sm font-medium">Historique</p>
            <ol className="mt-3 space-y-4 border-l border-border/60 pl-4">
              {demande.statusHistory.map((h) => (
                <li key={h.id} className="relative">
                  <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-primary" />
                  <StatusBadge status={h.status} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(h.changedAt, "d MMM yyyy 'à' HH:mm", { locale: fr })}
                    {h.changedByUser ? ` · ${h.changedByUser.name}` : ""}
                  </p>
                  {h.note && <p className="mt-1 text-sm">{h.note}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
