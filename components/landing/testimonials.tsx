import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    name: "Camille R.",
    role: "Clé de voiture perdue",
    quote:
      "Un agent m'a rappelée en moins de 10 minutes un dimanche soir. Ma clé était refaite le lendemain matin.",
  },
  {
    name: "Yanis B.",
    role: "Serrure bloquée",
    quote:
      "Intervention en 40 minutes après un appel en pleine nuit. Prix annoncé à l'avance, aucune surprise.",
  },
  {
    name: "Sophie L.",
    role: "Commande de clé neuve",
    quote:
      "J'ai suivi ma commande en temps réel depuis mon espace client, du dépôt de la demande jusqu'à la livraison.",
  },
];

export function Testimonials() {
  return (
    <section id="temoignages" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ils nous ont fait confiance
        </h2>
        <p className="mt-4 text-muted-foreground">
          Des milliers d&apos;interventions réussies partout en Grand Tunis.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} className="rounded-2xl border-border/60 bg-card/60">
            <CardContent className="pt-6">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-pretty">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {t.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
