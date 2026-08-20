"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field } from "@/components/forms/field";
import { addAgentAction } from "@/app/actions/agents";

const schema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Téléphone invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

type FormValues = z.infer<typeof schema>;

export function AddAgentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const result = await addAgentAction(values);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Agent ajouté");
    reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="rounded-xl" />}>
        <UserPlus className="size-4" />
        Ajouter un agent
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un agent</DialogTitle>
          <DialogDescription>Créez un compte pour un nouveau technicien.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Nom complet" htmlFor="agent-name" error={errors.name?.message} required>
            <Input id="agent-name" {...register("name")} />
          </Field>
          <Field label="Email" htmlFor="agent-email" error={errors.email?.message} required>
            <Input id="agent-email" type="email" {...register("email")} />
          </Field>
          <Field label="Téléphone" htmlFor="agent-phone" error={errors.phone?.message} required>
            <Input id="agent-phone" type="tel" {...register("phone")} />
          </Field>
          <Field label="Mot de passe temporaire" htmlFor="agent-password" error={errors.password?.message} required>
            <Input id="agent-password" type="password" {...register("password")} />
          </Field>
          <Button type="submit" disabled={loading} className="w-full rounded-xl">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
            Créer le compte agent
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
