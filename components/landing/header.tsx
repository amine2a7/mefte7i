"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, Menu, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#zone", label: "Zone d'intervention" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_-4px_var(--primary)]">
            <KeyRound className="size-5" />
          </span>
          <span className="text-lg tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Badge24 />
          <Button variant="ghost" render={<Link href="/login" />} nativeButton={false}>
            Espace agent
          </Button>
          <Button render={<Link href="/incident" />} nativeButton={false} className="shadow-[0_0_20px_-6px_var(--primary)]">
            Signaler un incident
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <KeyRound className="size-5 text-primary" />
                {APP_NAME}
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="outline" render={<Link href="/login" />} nativeButton={false} onClick={() => setOpen(false)}>
                  Espace agent
                </Button>
                <Button render={<Link href="/incident" />} nativeButton={false} onClick={() => setOpen(false)}>
                  Signaler un incident
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function Badge24() {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
      <ShieldAlert className="size-3.5" />
      Urgence 24/7
    </span>
  );
}
