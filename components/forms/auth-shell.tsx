import Link from "next/link";
import { KeyRound } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, color-mix(in oklch, var(--primary) 14%, transparent), transparent)",
        }}
      />

      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <KeyRound className="size-5" />
        </span>
        <span className="text-lg tracking-tight">{APP_NAME}</span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card/60 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-8">{children}</div>

        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
