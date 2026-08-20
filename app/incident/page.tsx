import { SimpleHeader } from "@/components/layout/simple-header";
import { IncidentForm } from "@/components/forms/incident-form";
import { Siren } from "lucide-react";

export default function IncidentPage() {
  return (
    <>
      <SimpleHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Siren className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Déclarer un incident</h1>
            <p className="text-sm text-muted-foreground">
              Un agent vous contacte rapidement pour confirmer votre demande.
            </p>
          </div>
        </div>

        <IncidentForm />
      </main>
    </>
  );
}
