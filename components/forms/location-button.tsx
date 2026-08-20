"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationButton({
  onLocated,
}: {
  onLocated: (data: { address: string; lat: number; lng: number }) => void;
}) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (!("geolocation" in navigator)) {
      toast.error("La géolocalisation n'est pas disponible sur cet appareil");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { Accept: "application/json" } },
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.display_name) address = data.display_name;
          }
        } catch {
          // Reverse geocoding failed; fall back to raw coordinates.
        }
        onLocated({ address, lat: latitude, lng: longitude });
        toast.success("Position détectée");
        setLoading(false);
      },
      () => {
        toast.error("Impossible d'accéder à votre position");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="rounded-xl"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <LocateFixed className="size-4" />}
      Utiliser ma position
    </Button>
  );
}
