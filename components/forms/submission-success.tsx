"use client";

import Link from "next/link";
import { CircleCheck, Copy, Home, KeyRound, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SUPPORT_PHONE } from "@/lib/constants";

export function SubmissionSuccess({
  title,
  description,
  clientCode,
}: {
  title: string;
  description: string;
  clientCode?: string;
}) {
  function copyCode() {
    if (!clientCode) return;
    navigator.clipboard.writeText(clientCode).then(() => toast.success("Code copié"));
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center rounded-2xl border border-border/60 bg-card/60 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
        <CircleCheck className="size-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {clientCode && (
        <div className="mt-6 w-full rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary">
            <KeyRound className="size-3.5" />
            Votre code de confirmation
          </p>
          <button
            type="button"
            onClick={copyCode}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-background/60 px-3 py-2 font-mono text-lg font-semibold tracking-[0.3em]"
          >
            {clientCode}
            <Copy className="size-4 text-muted-foreground" />
          </button>
          <p className="mt-2 text-xs text-muted-foreground text-pretty">
            Gardez-le précieusement : avec votre numéro de téléphone, il vous servira à confirmer
            le service et le paiement sur{" "}
            <Link href="/suivi" className="text-primary hover:underline">
              la page de suivi
            </Link>
            .
          </p>
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <PhoneCall className="size-4 text-primary" />
        Une urgence ? Appelez le {SUPPORT_PHONE}
      </p>
      <Button render={<Link href="/" />} nativeButton={false} variant="outline" className="mt-6 h-11 rounded-xl">
        <Home className="size-4" />
        Retour à l&apos;accueil
      </Button>
    </div>
  );
}
