import { SimpleHeader } from "@/components/layout/simple-header";
import { SuiviSearch } from "@/components/forms/suivi-search";
import { ShieldCheck } from "lucide-react";

export default function SuiviPage() {
  return (
    <>
      <SimpleHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Suivre ma demande</h1>
            <p className="text-sm text-muted-foreground">
              Retrouvez vos demandes avec votre numéro de téléphone.
            </p>
          </div>
        </div>

        <SuiviSearch />
      </main>
    </>
  );
}
