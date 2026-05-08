import Link from "next/link";
import { navItems } from "@/lib/data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6 py-3 max-md:flex-col max-md:items-start">
        <Link className="inline-flex items-center gap-3 text-base font-black no-underline" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-sm text-white">HI</span>
          <span>HI on AI</span>
        </Link>
        <nav className="flex flex-wrap gap-5 text-sm font-semibold text-muted" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link className="transition hover:text-ink" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
