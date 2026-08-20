import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function SimpleHeader({ backHref = "/" }: { backHref?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href={backHref} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Retour
        </Link>
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <KeyRound className="size-4" />
          </span>
          <span className="tracking-tight">{APP_NAME}</span>
        </div>
      </div>
    </header>
  );
}
