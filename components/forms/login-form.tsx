"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { loginAction } from "@/app/actions/auth";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const result = await loginAction(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Connexion réussie");
      router.push(next || result.data.redirectTo);
      router.refresh();
    } catch {
      toast.error("Erreur serveur. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.fr"
          className="h-11"
          {...register("email")}
        />
      </Field>

      <Field label="Mot de passe" htmlFor="password" error={errors.password?.message} required>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-11"
          {...register("password")}
        />
      </Field>

      <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl text-base">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Se connecter
      </Button>
    </form>
  );
}
