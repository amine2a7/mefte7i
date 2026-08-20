"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { previewDemandesCountAction, deleteDemandesInRangeAction } from "@/app/actions/admin";

export function DeleteDemandesDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [kind, setKind] = useState<"TOUS" | "INCIDENT" | "COMMANDE">("TOUS");
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  function reset() {
    setStartDate("");
    setEndDate("");
    setKind("TOUS");
    setPreviewCount(null);
  }

  async function handlePreview() {
    setLoading(true);
    const result = await previewDemandesCountAction({ startDate, endDate, kind });
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setPreviewCount(result.data.count);
  }

  async function handleDelete() {
    setLoading(true);
    const result = await deleteDemandesInRangeAction({ startDate, endDate, kind });
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(`${result.data.count} demande(s) supprimée(s) définitivement`);
    reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <Trash2 className="size-4" />
        Supprimer des demandes
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer des demandes définitivement</DialogTitle>
          <DialogDescription>
            Supprime les incidents et/ou commandes créés dans la période choisie. Action
            irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="del-start">Du</Label>
              <Input
                id="del-start"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPreviewCount(null);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="del-end">Au</Label>
              <Input
                id="del-end"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPreviewCount(null);
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={kind}
              onValueChange={(v) => {
                setKind((v ?? "TOUS") as typeof kind);
                setPreviewCount(null);
              }}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TOUS">Incidents et commandes</SelectItem>
                <SelectItem value="INCIDENT">Incidents uniquement</SelectItem>
                <SelectItem value="COMMANDE">Commandes uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {previewCount === null ? (
            <Button
              variant="outline"
              className="w-full rounded-xl"
              disabled={loading || !startDate || !endDate}
              onClick={handlePreview}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              Vérifier le nombre de demandes concernées
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {previewCount === 0
                  ? "Aucune demande dans cette période."
                  : `${previewCount} demande(s) seront supprimées définitivement, y compris leur historique.`}
              </p>
              {previewCount > 0 && (
                <Button
                  variant="destructive"
                  className="w-full rounded-xl"
                  disabled={loading}
                  onClick={handleDelete}
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  Confirmer la suppression définitive
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
