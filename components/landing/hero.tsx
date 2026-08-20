import Link from "next/link";
import Image from "next/image";
import { KeyRound, ShieldCheck, Siren, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, EMERGENCY_AVAILABLE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, color-mix(in oklch, var(--primary) 18%, transparent), transparent), radial-gradient(50% 40% at 10% 10%, color-mix(in oklch, var(--accent) 14%, transparent), transparent)",
        }}
      />

      <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-32 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Siren className="size-3.5" />
            Intervention {EMERGENCY_AVAILABLE}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Votre sécurité, en de bonnes{" "}
            <span className="text-primary">mains</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
            {APP_NAME} répare et remplace vos clés de voiture et de maison, où
            que vous soyez. Des experts certifiés, une intervention rapide, un
            suivi transparent de bout en bout.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              render={<Link href="/incident" />}
              nativeButton={false}
              className="h-14 rounded-2xl px-8 text-base shadow-[0_0_30px_-8px_var(--primary)]"
            >
              <Siren className="size-5" />
              Signaler un incident
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/commande" />}
              nativeButton={false}
              className="h-14 rounded-2xl px-8 text-base"
            >
              <KeyRound className="size-5" />
              Acheter une clé
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" />
              Techniciens certifiés
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              Devis transparent
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center lg:max-w-lg">
          <div
            className="absolute inset-0 opacity-60 blur-3xl"
            style={{
              background:
                "conic-gradient(from 180deg, var(--primary), var(--accent), var(--primary))",
            }}
          />
          <div className="relative size-full overflow-hidden rounded-full border border-white/10 shadow-2xl">
            <Image
              src="/hero-key.png"
              alt="Clé de voiture et clé classique sur un porte-clés"
              fill
              priority
              sizes="(min-width: 1024px) 32rem, 24rem"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10 ring-inset" />
          </div>
        </div>
      </div>
    </section>
  );
}
