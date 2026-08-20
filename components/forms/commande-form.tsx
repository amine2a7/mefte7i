"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Car, Home, Loader2, Minus, Plus, ShoppingBag, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/forms/field";
import { ChoiceCards } from "@/components/forms/choice-cards";
import { LocationButton } from "@/components/forms/location-button";
import { SubmissionSuccess } from "@/components/forms/submission-success";
import { createCommandeAction } from "@/app/actions/demandes";

const schema = z
  .object({
    bienType: z.enum(["VOITURE", "MAISON"]),
    marqueModeleOuSerrure: z.string().min(1, "Ce champ est requis"),
    avecProgrammation: z.boolean(),
    quantite: z.number().int().min(1).max(20),
    modeLivraison: z.enum(["RETRAIT", "LIVRAISON"]),
    adresseLivraison: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    nomContact: z.string().min(2, "Le nom est requis"),
    telephoneContact: z.string().min(6, "Téléphone invalide"),
    emailContact: z.string().email("Email invalide"),
  })
  .refine(
    (data) => data.modeLivraison !== "LIVRAISON" || (data.adresseLivraison?.length ?? 0) >= 5,
    { message: "Adresse de livraison requise", path: ["adresseLivraison"] },
  );

type FormValues = z.infer<typeof schema>;

export function CommandeForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bienType: "VOITURE",
      avecProgrammation: false,
      quantite: 1,
      modeLivraison: "RETRAIT",
    },
  });

  const bienType = watch("bienType");
  const modeLivraison = watch("modeLivraison");
  const quantite = watch("quantite");

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const result = await createCommandeAction(values);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Votre commande a été envoyée");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SubmissionSuccess
        title="Votre commande a été envoyée"
        description="Un agent va vous contacter pour confirmer les détails et le prix."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Type de clé</h2>
        <Controller
          control={control}
          name="bienType"
          render={({ field }) => (
            <ChoiceCards
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "VOITURE", label: "Voiture", icon: Car },
                { value: "MAISON", label: "Maison", icon: Home },
              ]}
            />
          )}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Détails de la clé</h2>
        <Field
          label={bienType === "MAISON" ? "Type de serrure" : "Marque et modèle du véhicule"}
          htmlFor="marqueModeleOuSerrure"
          error={errors.marqueModeleOuSerrure?.message}
          required
        >
          <Input
            id="marqueModeleOuSerrure"
            className="h-12"
            placeholder={bienType === "MAISON" ? "Ex : cylindre européen" : "Ex : Renault Clio 4"}
            {...register("marqueModeleOuSerrure")}
          />
        </Field>

        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Avec programmation / copie de puce</p>
            <p className="text-xs text-muted-foreground">Nécessaire pour les clés électroniques</p>
          </div>
          <Controller
            control={control}
            name="avecProgrammation"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <Field label="Quantité" htmlFor="quantite" error={errors.quantite?.message} required>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-xl"
              onClick={() => setValue("quantite", Math.max(1, quantite - 1))}
            >
              <Minus className="size-4" />
            </Button>
            <Input
              id="quantite"
              readOnly
              value={quantite}
              className="h-11 w-16 text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-xl"
              onClick={() => setValue("quantite", Math.min(20, quantite + 1))}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Retrait ou livraison</h2>
        <Controller
          control={control}
          name="modeLivraison"
          render={({ field }) => (
            <ChoiceCards
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "RETRAIT", label: "Retrait en agence", icon: Store },
                { value: "LIVRAISON", label: "Livraison", icon: Truck },
              ]}
            />
          )}
        />
        {modeLivraison === "LIVRAISON" && (
          <>
            <Field label="Adresse de livraison" htmlFor="adresseLivraison" error={errors.adresseLivraison?.message} required>
              <Input
                id="adresseLivraison"
                className="h-12"
                placeholder="12 rue de la Paix, 75002 Tunis "
                {...register("adresseLivraison")}
              />
            </Field>
            <LocationButton
              onLocated={({ address, lat, lng }) => {
                setValue("adresseLivraison", address, { shouldValidate: true });
                setValue("latitude", lat);
                setValue("longitude", lng);
              }}
            />
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Vos coordonnées</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet" htmlFor="nomContact" error={errors.nomContact?.message} required>
            <Input id="nomContact" className="h-12" {...register("nomContact")} />
          </Field>
          <Field label="Téléphone" htmlFor="telephoneContact" error={errors.telephoneContact?.message} required>
            <Input id="telephoneContact" type="tel" className="h-12" {...register("telephoneContact")} />
          </Field>
        </div>
        <Field label="Email" htmlFor="emailContact" error={errors.emailContact?.message} required>
          <Input id="emailContact" type="email" className="h-12" {...register("emailContact")} />
        </Field>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="submit" disabled={loading} className="h-14 w-full rounded-2xl text-base shadow-[0_0_30px_-8px_var(--primary)]">
          {loading ? <Loader2 className="size-5 animate-spin" /> : <ShoppingBag className="size-5" />}
          Envoyer ma commande
        </Button>
      </div>
    </form>
  );
}
