import { SimpleHeader } from "@/components/layout/simple-header";
import { CommandeForm } from "@/components/forms/commande-form";
import { ShoppingBag } from "lucide-react";

export default function CommandePage() {
  return (
    <>
      <SimpleHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Commander une clé</h1>
            <p className="text-sm text-muted-foreground">
              Clé neuve, avec ou sans programmation, livrée ou à retirer en agence.
            </p>
          </div>
        </div>

        <CommandeForm />
      </main>
    </>
  );
}
