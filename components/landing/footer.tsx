import Link from "next/link";
import { KeyRound, Mail, MapPin, Phone } from "lucide-react";
import { APP_NAME, APP_TAGLINE, SUPPORT_PHONE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <KeyRound className="size-5" />
              </span>
              <span className="text-lg tracking-tight">{APP_NAME}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{APP_TAGLINE}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Réparation clé voiture</li>
              <li>Réparation clé maison</li>
              <li>Vente de clés neuves</li>
              <li>Programmation de puces</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Entreprise</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Espace agent
                </Link>
              </li>
              <li>Mentions légales</li>
              <li>Politique de confidentialité</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" /> {SUPPORT_PHONE}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" /> aminekhadraoui51@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Tunis  & Grand Tunis
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
          </p>
          <p>Serrurerie & sécurité — intervention rapide, service 24h/24 et 7j/7.</p>
        </div>
      </div>
    </footer>
  );
}
