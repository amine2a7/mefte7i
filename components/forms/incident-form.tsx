"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Car, Home, Loader2, MapPin, Siren, CircleAlert, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/forms/field";
import { ChoiceCards } from "@/components/forms/choice-cards";
import { PhotoUpload } from "@/components/forms/photo-upload";
import { LocationButton } from "@/components/forms/location-button";
import { SubmissionSuccess } from "@/components/forms/submission-success";
import { createIncidentAction } from "@/app/actions/demandes";

const VOITURE_PROBLEMS = [
  { value: "cle_cassee", label: "Clé cassée" },
  { value: "telecommande_hs", label: "Télécommande HS" },
  { value: "perte_cle", label: "Perte de clé" },
  { value: "cle_bloquee_contact", label: "Clé bloquée dans le contact" },
  { value: "autre", label: "Autre" },
];

const MAISON_PROBLEMS = [
  { value: "cle_cassee_serrure", label: "Clé cassée dans la serrure" },
  { value: "serrure_bloquee", label: "Serrure bloquée" },
  { value: "perte_cle", label: "Perte de clé" },
  { value: "porte_claquee", label: "Porte claquée" },
  { value: "autre", label: "Autre" },
];

const schema = z.object({
  bienType: z.enum(["VOITURE", "MAISON"]),
  problemType: z.string().min(1, "Sélectionnez un type de problème"),
  description: z.string().min(10, "Merci de décrire le problème (10 caractères min.)"),
  urgence: z.enum(["NORMAL", "URGENT", "TRES_URGENT"]),
  adresseIntervention: z.string().min(5, "Adresse requise"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  nomContact: z.string().min(2, "Le nom est requis"),
  telephoneContact: z.string().min(6, "Téléphone invalide"),
  emailContact: z.string().email("Email invalide"),
});

type FormValues = z.infer<typeof schema>;

export function IncidentForm() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
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
      urgence: "NORMAL",
      problemType: "",
    },
  });

  const bienType = watch("bienType");
  const problemOptions = bienType === "MAISON" ? MAISON_PROBLEMS : VOITURE_PROBLEMS;

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const result = await createIncidentAction({ ...values, photos });
    setLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Votre demande a été envoyée");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SubmissionSuccess
        title="Votre demande a été envoyée"
        description="Un agent va vous contacter très prochainement pour confirmer l'intervention."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Bien concerné</h2>
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

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Le problème</h2>
        <Controller
          control={control}
          name="problemType"
          render={({ field }) => (
            <Field label="Type de problème" htmlFor="problemType" error={errors.problemType?.message} required>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="problemType" className="h-12 w-full">
                  <SelectValue placeholder="Sélectionnez un problème" />
                </SelectTrigger>
                <SelectContent>
                  {problemOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Field label="Description du problème" htmlFor="description" error={errors.description?.message} required>
          <Textarea
            id="description"
            rows={4}
            placeholder="Décrivez ce qui s'est passé, l'état de la clé ou de la serrure..."
            {...register("description")}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Niveau d&apos;urgence</h2>
        <Controller
          control={control}
          name="urgence"
          render={({ field }) => (
            <ChoiceCards
              value={field.value}
              onChange={field.onChange}
              columns={3}
              options={[
                { value: "NORMAL", label: "Normal", icon: Clock },
                { value: "URGENT", label: "Urgent", description: "24-48h", icon: CircleAlert, accentClassName: "border-accent bg-accent/10" },
                { value: "TRES_URGENT", label: "Très urgent", description: "Aujourd'hui", icon: Siren, accentClassName: "border-destructive bg-destructive/10" },
              ]}
            />
          )}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Où intervenir</h2>
        <Field label="Adresse d'intervention" htmlFor="adresseIntervention" error={errors.adresseIntervention?.message} required>
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="adresseIntervention"
              placeholder="12 rue de la Paix, 75002 Tunis "
              className="h-12 pl-9"
              {...register("adresseIntervention")}
            />
          </div>
        </Field>
        <LocationButton
          onLocated={({ address, lat, lng }) => {
            setValue("adresseIntervention", address, { shouldValidate: true });
            setValue("latitude", lat);
            setValue("longitude", lng);
          }}
        />
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

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Photo(s) du problème</h2>
        <PhotoUpload value={photos} onChange={setPhotos} />
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="submit" disabled={loading} className="h-14 w-full rounded-2xl text-base shadow-[0_0_30px_-8px_var(--primary)]">
          {loading ? <Loader2 className="size-5 animate-spin" /> : <Siren className="size-5" />}
          Envoyer ma demande
        </Button>
      </div>
    </form>
  );
}
