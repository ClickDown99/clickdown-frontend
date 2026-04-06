"use client";

import { useState } from "react";
import { Button, Kbd, TextField, InputGroup, Link, Avatar } from "@heroui/react";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { usePathname, useRouter } from "next/navigation";
import { FiGithub, FiGrid, FiLogIn, FiUserPlus } from "react-icons/fi";
import { LogoutButton } from "@/app/login/components/logout-button";
import { useAuth } from "@/app/login/hooks/use-auth";


export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter(); 
  const { isAuthenticated, isLoading, user } = useAuth();

  const navItems = isAuthenticated
    ? [
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
      ]
    : siteConfig.navItems;
  

  const searchInput = (
    <TextField aria-label="Search" type="search">
      <InputGroup>
        <InputGroup.Prefix>
         
        </InputGroup.Prefix>
        <InputGroup.Input className="text-sm" placeholder="Search..." />
        <InputGroup.Suffix>
          <Kbd className="hidden lg:inline-flex">
            <Kbd.Abbr keyValue="command" />
            <Kbd.Content>K</Kbd.Content>
          </Kbd>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 rounded-full border border-black/8 bg-white/78 px-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[#081624]/78 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:px-6">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-3 no-underline" href="/">
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">ClikDown</p>
            </div>
          </Link>
          <ul className="hidden lg:flex gap-2 ml-2">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors no-underline",
                    "text-slate-700 hover:bg-black/5 hover:text-slate-950",
                    "dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white",
                    pathname === item.href &&
                      "bg-black/6 text-slate-950 dark:bg-white/10 dark:text-white",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <a
            aria-label="Github"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-black/5 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/6 dark:hover:text-white"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FiGithub />
          </a>
          <ThemeSwitch />
          {isLoading ? null : isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-full border border-black/8 bg-white/65 px-3 py-2 dark:border-white/10 dark:bg-white/6">
                <Avatar className="h-8 w-8 bg-[var(--app-accent)] text-xs text-white">
                  <span>{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}</span>
                </Avatar>
                <div className="max-w-36 overflow-hidden">
                  <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                    {user?.firstName || "Usuario"}
                  </p>
                  <p className="truncate text-xs text-slate-600 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>
              <Button
                className="rounded-full"
                variant="secondary"
                onPress={() => router.push("/dashboard")}
              >
                <span className="inline-flex items-center gap-2">
                  <FiGrid />
                  Painel
                </span>
              </Button>
              <LogoutButton className="rounded-full" variant="ghost" />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                className="no-underline inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-black/5 dark:border-white/10 dark:text-slate-100 dark:hover:bg-white/6"
                href="/register"
              >
                <FiUserPlus />
                Cadastro
              </Link>
              <Link
                className="no-underline inline-flex items-center gap-2 rounded-full bg-[var(--app-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--app-accent-strong)]"
                href="/login"
              >
                <FiLogIn />
                Entrar
              </Link>
            </div>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <a
            aria-label="Github"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/6"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FiGithub />
          </a>
          <ThemeSwitch />
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition hover:bg-black/5 dark:text-white dark:hover:bg-white/6"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-separator sm:hidden">
          <div className="p-4">{searchInput}</div>
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  className={clsx(
                    "block py-2 text-lg no-underline",
                    index === 2
                      ? "text-accent"
                      : index === siteConfig.navMenuItems.length - 1
                        ? "text-danger"
                        : "text-foreground",
                  )}
                  href="#"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
