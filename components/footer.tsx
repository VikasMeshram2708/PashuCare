"use client";

import Link from "next/link";

export function Footer() {
  const links = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Contact", href: "#" },
  ] as const;

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand + Copyright */}
          <div className="flex flex-col gap-1">
            <Link href="#" className="text-sm font-semibold tracking-tight">
              PashuCare AI
            </Link>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PashuCare AI. All rights reserved.
            </p>
          </div>

          {/* Legal / Utility Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
