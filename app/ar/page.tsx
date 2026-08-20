import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Car,
  Home,
  KeyRound,
  MapPin,
  Menu,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Star,
  Wrench,
  ShoppingBag,
  ClipboardList,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_URL, SUPPORT_PHONE, EMERGENCY_AVAILABLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "مفتاحي — أمانك، مفتاحك",
  description:
    "خدمات الأقفال والأمان في تونس: إصلاح وبيع مفاتيح السيارات والمنازل. تدخل سريع في تونس الكبرى، خدمة على مدار الساعة طوال أيام الأسبوع.",
  alternates: {
    canonical: `${SITE_URL}/ar`,
    languages: { fr: SITE_URL, ar: `${SITE_URL}/ar` },
  },
};

const NAV_LINKS = [
  { href: "#services", label: "الخدمات" },
  { href: "#comment-ca-marche", label: "كيف يعمل الموقع" },
  { href: "#temoignages", label: "آراء العملاء" },
  { href: "#zone", label: "منطقة التدخل" },
];

const SERVICES = [
  {
    icon: Car,
    title: "سيارة",
    description: "مفاتيح مكسورة، ريموت كنترول معطل، فقدان المفتاح، برمجة الرقاقات الإلكترونية.",
    items: ["إصلاح ونسخ المفاتيح", "إعادة برمجة الريموت كنترول", "مفتاح عالق في التماس"],
  },
  {
    icon: Home,
    title: "منزل",
    description: "أقفال عالقة، مفاتيح مكسورة في القفل، تغيير الأسطوانة، باب مغلق بقوة.",
    items: ["فك انسداد القفل", "تغيير الأسطوانة", "فتح الباب دون تلف"],
  },
];

const STEPS = [
  { icon: ClipboardList, title: "صف احتياجك", description: "أبلغ عن حادث أو اطلب مفتاحًا في نقرات قليلة من هاتفك." },
  { icon: PhoneCall, title: "وكيل يتصل بك", description: "يؤكد وكيل طلبك، يقيّم المشكلة ويقترح عليك السعر." },
  { icon: Wrench, title: "تدخل أو تسليم", description: "إصلاح في الموقع أو تسليم مفتاحك الجديد حسب طلبك." },
  { icon: ShieldCheck, title: "دفع آمن", description: "تدفع فقط بعد انتهاء التدخل والتأكد منه." },
];

const TESTIMONIALS = [
  { name: "Camille R.", role: "فقدان مفتاح السيارة", quote: "اتصل بي وكيل في أقل من 10 دقائق يوم أحد مساءً. كان مفتاحي جاهزًا صباح اليوم التالي." },
  { name: "Yanis B.", role: "قفل عالق", quote: "تدخل في 40 دقيقة بعد اتصال في منتصف الليل. السعر معلن مسبقًا، بدون أي مفاجآت." },
  { name: "Sophie L.", role: "طلب مفتاح جديد", quote: "طلبت مفتاحي في دقيقتين من هاتفي، وكان جاهزًا في الوكالة في نفس اليوم." },
];

const CITIES = ["تونس", "أريانة", "بن عروس", "منوبة", "المرسى", "حلق الوادي", "رادس", "الكرم"];

export default function ArabicHomePage() {
  return (
    <div dir="rtl" lang="ar" className="flex min-h-screen flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/ar" className="flex items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <KeyRound className="size-5" />
            </span>
            <span className="text-lg tracking-tight">مفتاحي</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent md:flex">
              <ShieldAlert className="size-3.5" />
              تدخل 24/24 - 7/7
            </span>
            <Button variant="ghost" render={<Link href="/" />} nativeButton={false} className="h-9 px-3 text-xs">
              FR
            </Button>
            <Button variant="ghost" render={<Link href="/suivi" />} nativeButton={false} className="hidden sm:inline-flex">
              تتبع
            </Button>
            <Button render={<Link href="/incident" />} nativeButton={false} className="hidden shadow-[0_0_20px_-6px_var(--primary)] sm:inline-flex">
              الإبلاغ عن حادث
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 50% at 20% 0%, color-mix(in oklch, var(--primary) 18%, transparent), transparent), radial-gradient(50% 40% at 90% 10%, color-mix(in oklch, var(--accent) 14%, transparent), transparent)",
            }}
          />

          <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-32 lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Siren className="size-3.5" />
                تدخل {EMERGENCY_AVAILABLE}
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                أمانتك في أيدٍ <span className="text-primary">أمينة</span>.
              </h1>

              <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
                مفتاحي يصلح ويستبدل مفاتيح سيارتك ومنزلك أينما كنت. خبراء معتمدون، تدخل سريع،
                ومتابعة شفافة من الألف إلى الياء.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" render={<Link href="/incident" />} nativeButton={false} className="h-14 rounded-2xl px-8 text-base shadow-[0_0_30px_-8px_var(--primary)]">
                  <Siren className="size-5" />
                  الإبلاغ عن حادث
                </Button>
                <Button size="lg" variant="outline" render={<Link href="/commande" />} nativeButton={false} className="h-14 rounded-2xl px-8 text-base">
                  <KeyRound className="size-5" />
                  شراء مفتاح
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-accent" />
                  فنيون معتمدون
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  عرض سعر شفاف
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md pr-6 pb-8 lg:max-w-lg">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                <Image
                  src="/hero-key.png"
                  alt="مفتاح سيارة ومفتاح تقليدي على حلقة مفاتيح"
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, 24rem"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/10 ring-inset" />
              </div>

              <div className="absolute bottom-0 right-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-background/90 px-4 py-3 shadow-xl backdrop-blur">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">تدخل مضمون</p>
                  <p className="text-xs text-muted-foreground">عرض سعر واضح قبل العمل</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">عالمان، خبرة واحدة</h2>
            <p className="mt-4 text-muted-foreground">
              سواء كان الأمر يتعلق بسيارتك أو منزلك، يتدخل فريقنا من الفنيين المعتمدين بسرعة
              ويبيع مفاتيح جديدة، مع أو بدون برمجة.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-border/60 bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_40px_-15px_var(--primary)]"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="size-7" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">{service.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <KeyRound className="size-3.5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button render={<Link href="/incident" />} nativeButton={false} size="sm" className="rounded-xl">
                    <Wrench className="size-4" />
                    الإبلاغ عن حادث
                  </Button>
                  <Button render={<Link href="/commande" />} nativeButton={false} size="sm" variant="outline" className="rounded-xl">
                    <ShoppingBag className="size-4" />
                    طلب مفتاح
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="comment-ca-marche" className="border-y border-border/60 bg-card/30 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">كيف يعمل الموقع</h2>
              <p className="mt-4 text-muted-foreground">مسار بسيط، مصمم للحالات المستعجلة.</p>
            </div>

            <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="size-7" />
                    <span className="absolute -top-2 -left-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="temoignages" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">ثقة عملائنا</h2>
            <p className="mt-4 text-muted-foreground">آلاف التدخلات الناجحة في جميع أنحاء تونس الكبرى.</p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border/60 bg-card/60 p-6">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground text-pretty">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="zone" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 rounded-3xl border border-border/60 bg-card/40 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <MapPin className="size-3.5" />
                منطقة التدخل
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">حاضرون في جميع أنحاء تونس الكبرى</h2>
              <p className="mt-4 text-muted-foreground">
                فنيونا منتشرون في جميع أنحاء المنطقة لضمان أقصر وقت تدخل، حتى في حالات الطوارئ.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {CITIES.map((city) => (
                  <span key={city} className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground">
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
              <Siren className="mx-auto size-10 text-accent" />
              <h3 className="mt-4 text-2xl font-semibold">تدخل {EMERGENCY_AVAILABLE}</h3>
              <p className="mt-2 text-sm text-muted-foreground">فني متاح في أي وقت، بما في ذلك عطلات نهاية الأسبوع والأعياد.</p>
              <p className="mt-6 text-2xl font-semibold tracking-tight text-accent" dir="ltr">
                {SUPPORT_PHONE}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <KeyRound className="size-5" />
                </span>
                <span className="text-lg tracking-tight">مفتاحي</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">أمانك، مفتاحك</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">الخدمات</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>إصلاح مفتاح السيارة</li>
                <li>إصلاح مفتاح المنزل</li>
                <li>بيع مفاتيح جديدة</li>
                <li>برمجة الرقاقات</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">الشركة</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/suivi" className="hover:text-foreground">تتبع طلبي</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground">مساحة الوكيل</Link>
                </li>
                <li>الشروط القانونية</li>
                <li>سياسة الخصوصية</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">تواصل معنا</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <PhoneCall className="size-4 text-primary" />
                  <span dir="ltr">{SUPPORT_PHONE}</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> contact@mefte7i.tn
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" /> تونس الكبرى
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row">
            <p>© {new Date().getFullYear()} مفتاحي. جميع الحقوق محفوظة.</p>
            <p>أقفال وأمان — تدخل سريع، خدمة على مدار الساعة طوال أيام الأسبوع.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
