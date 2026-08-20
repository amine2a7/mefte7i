import { MapPin, Siren } from "lucide-react";
import { EMERGENCY_AVAILABLE, SUPPORT_PHONE } from "@/lib/constants";

const CITIES = [
  "Tunis ",
  "Ariana",
  "Ben Arous",
  "Marsa",
  "La Goulette",
  "Carthage",
  "Sidi Bou Said",
  "La Soukra",
  "Raoued",
  "El Menzah",
  "El Manar",
  

  

 
  
];

export function CoverageZone() {
  return (
    <section id="zone" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 rounded-3xl border border-border/60 bg-card/40 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <MapPin className="size-3.5" />
            Zone d&apos;intervention
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Présents partout en Grand Tunis
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nos techniciens sont répartis sur tout le territoire pour garantir
            un délai d&apos;intervention minimal, même en cas d&apos;urgence.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <span
                key={city}
                className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground"
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Siren className="mx-auto size-10 text-accent" />
          <h3 className="mt-4 text-2xl font-semibold">Urgence {EMERGENCY_AVAILABLE}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Un technicien disponible à tout moment, week-ends et jours fériés
            compris.
          </p>
          <p className="mt-6 text-2xl font-semibold tracking-tight text-accent">
            {SUPPORT_PHONE}
          </p>
        </div>
      </div>
    </section>
  );
}
