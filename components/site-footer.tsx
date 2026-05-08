import Link from "next/link";
import { navItems } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white py-8 text-sm text-muted">
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6 max-md:flex-col max-md:items-start">
        <p className="m-0">&copy; 2026 HI on AI.</p>
        <nav className="flex flex-wrap gap-5" aria-label="Footer navigation">
          {navItems.map((item) => (
            <Link className="transition hover:text-ink" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
