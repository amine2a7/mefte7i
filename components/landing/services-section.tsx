import Link from "next/link";
import { Car, Home, Key, ArrowRight, Wrench, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SERVICES = [
  {
    icon: Car,
    title: "Voiture",
    description:
      "Clés cassées, télécommandes défectueuses, perte de clé, programmation de puces électroniques.",
    items: [
      "Réparation & duplication de clés",
      "Reprogrammation de télécommandes",
      "Clé bloquée dans le contact",
    ],
  },
  {
    icon: Home,
    title: "Maison",
    description:
      "Serrures bloquées, clés cassées dans la serrure, changement de cylindre, porte claquée.",
    items: [
      "Déblocage de serrure",
      "Changement de cylindre",
      "Ouverture de porte sans dégât",
    ],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Deux univers, une seule expertise
        </h2>
        <p className="mt-4 text-muted-foreground">
          Que ce soit pour votre véhicule ou votre domicile, notre réseau de
          techniciens certifiés intervient rapidement et vend des clés neuves,
          avec ou sans programmation.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {SERVICES.map((service) => (
          <Card
            key={service.title}
            className="group rounded-2xl border-border/60 bg-card/60 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_40px_-15px_var(--primary)]"
          >
            <CardHeader>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="size-7" />
              </div>
              <CardTitle className="mt-4 text-2xl">{service.title}</CardTitle>
              <CardDescription className="text-base">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Key className="size-3.5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button render={<Link href="/incident" />} nativeButton={false} size="sm" className="rounded-xl">
                  <Wrench className="size-4" />
                  Déclarer un incident
                  <ArrowRight className="size-4" />
                </Button>
                <Button render={<Link href="/commande" />} nativeButton={false} size="sm" variant="outline" className="rounded-xl">
                  <ShoppingBag className="size-4" />
                  Commander une clé
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
