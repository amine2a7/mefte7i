"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MAX_PHOTOS = 5;
const MAX_SIZE_BYTES = 4 * 1024 * 1024;

export function PhotoUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (photos: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = MAX_PHOTOS - value.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_PHOTOS} photos`);
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    const readAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        if (file.size > MAX_SIZE_BYTES) {
          reject(new Error(`${file.name} dépasse 4 Mo`));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const results = await Promise.allSettled(selected.map(readAsDataUrl));
    const newPhotos = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
      .map((r) => r.value);
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      toast.error("Certains fichiers n'ont pas pu être ajoutés (trop volumineux)");
    }
    onChange([...value, ...newPhotos]);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {value.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Camera className="size-5" />
            <span className="text-xs">Ajouter</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {value.length === 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="size-4" />
          Ajouter une photo (optionnel)
        </Button>
      )}
    </div>
  );
}
