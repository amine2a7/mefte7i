"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
  accentClassName?: string;
};

export function ChoiceCards<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: ChoiceOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3",
      )}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-4 text-center transition-all active:scale-[0.98]",
              selected
                ? cn("border-primary bg-primary/10 shadow-[0_0_0_1px_var(--primary)]", opt.accentClassName)
                : "border-border bg-background/40 hover:border-border/80 hover:bg-card/60",
            )}
          >
            {opt.icon && (
              <opt.icon
                className={cn("size-6", selected ? "text-primary" : "text-muted-foreground")}
              />
            )}
            <span className={cn("text-sm font-medium", selected && "text-foreground")}>
              {opt.label}
            </span>
            {opt.description && (
              <span className="text-xs text-muted-foreground">{opt.description}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
