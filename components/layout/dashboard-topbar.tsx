import Link from "next/link";
import { KeyRound } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { UserMenu } from "@/components/layout/user-menu";

const ROLE_LABEL: Record<"AGENT" | "ADMIN", string> = {
  AGENT: "Espace agent",
  ADMIN: "Espace admin",
};

export function DashboardTopbar({
  role,
  userName,
  userEmail,
  actions,
}: {
  role: "AGENT" | "ADMIN";
  userName: string;
  userEmail: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <KeyRound className="size-5" />
          </span>
          <span className="hidden text-lg tracking-tight sm:inline">{APP_NAME}</span>
          <span className="hidden rounded-full border border-border/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
            {ROLE_LABEL[role]}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {actions}
          <UserMenu userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </header>
  );
}
