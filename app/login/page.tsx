import Link from "next/link";
import { AuthShell } from "@/components/forms/auth-shell";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      title="Espace agent & admin"
      subtitle="Connectez-vous pour gérer les demandes"
      footer={
        <Link href="/" className="font-medium text-primary hover:underline">
          Retour à l&apos;accueil
        </Link>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
