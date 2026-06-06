import Link from "next/link";
import { Scale } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Начало", href: "/" },
  { label: "Партии", href: "/parties" },
  { label: "Тест", href: "/quiz" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-cyan-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600 text-white shadow-sm">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-bold">Template</span>
            <span className="block text-xs font-medium text-slate-500">
              Обещания, действия, източници
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Главна">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-cyan-50 hover:text-cyan-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm">
          <Link href="/parties">Към партиите</Link>
        </Button>
      </div>
    </header>
  );
}
