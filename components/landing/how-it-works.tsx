import { ClipboardList, PhoneCall, Wrench, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Décrivez votre besoin",
    description:
      "Signalez un incident ou commandez une clé en quelques clics depuis votre téléphone.",
  },
  {
    icon: PhoneCall,
    title: "Un agent vous contacte",
    description:
      "Un technicien confirme votre demande, évalue le problème et vous propose un montant.",
  },
  {
    icon: Wrench,
    title: "Intervention ou livraison",
    description:
      "Réparation sur place ou livraison de votre nouvelle clé, selon votre demande.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé",
    description: "Vous payez une fois l'intervention terminée et validée.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      className="border-y border-border/60 bg-card/30 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-muted-foreground">
            Un parcours simple, pensé pour les urgences.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="size-7" />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-5 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
