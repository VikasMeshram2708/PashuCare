"use client";

import { Image, ImageKitProvider } from "@imagekit/next";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/contact", label: "Contact Us" },
  ] as const;

  return (
    <header className="p-4 sticky top-0 bg-background/75 backdrop-blur-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <LogoFn />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.label}
              className="text-sm hover:text-primary hover:underline hover:underline-offset-8 transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center">
                    <LogoFn />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <nav className="p-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.label}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <SheetFooter className="flex-col gap-2 items-stretch">
                <SignedOut>
                  <Button variant="link" asChild>
                    <SignInButton>Sign In</SignInButton>
                  </Button>
                  <Button asChild>
                    <SignUpButton>Sign Up</SignUpButton>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <SignedOut>
            <Button variant="link" asChild>
              <SignInButton>Sign In</SignInButton>
            </Button>
            <Button asChild>
              <SignUpButton>Sign Up</SignUpButton>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export function LogoFn({ className }: { className?: string }) {
  // Removed trailing space from URL
  const urlEndpoint = "https://ik.imagekit.io/kxstc2rku";

  return (
    <div>
      <ImageKitProvider urlEndpoint={urlEndpoint}>
        <Image
          src="/pashucare/veterinary%20ai/main_logo.png?updatedAt=1769840319703"
          width={200}
          height={10}
          alt="Logo"
          className={cn("object-cover w-28 md:w-52 h-auto", className)}
          priority
        />
      </ImageKitProvider>
    </div>
  );
}
