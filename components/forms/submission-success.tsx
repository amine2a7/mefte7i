import Link from "next/link";
import { CircleCheck, Home, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORT_PHONE } from "@/lib/constants";

export function SubmissionSuccess({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center rounded-2xl border border-border/60 bg-card/60 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
        <CircleCheck className="size-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
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
