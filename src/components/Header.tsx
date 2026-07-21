import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import { useMenu } from "../context/MenuContext";
import { LanguageDial } from "./LanguageDial";
import { ThemeToggle } from "./ThemeToggle";

const SECTIONS: Record<string, string> = {
  "/": "01",
  "/projects": "02",
  "/about": "03",
  "/contact": "04",
};

function DakarClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Africa/Dakar",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="meta hidden text-muted lg:inline" suppressHydrationWarning>
      Dakar {time}
    </span>
  );
}

export function Header() {
  const { toggle, isOpen } = useMenu();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section =
    SECTIONS[pathname] ?? (pathname.startsWith("/projects") ? "02" : "01");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Wordmark */}
        <Link
          to="/"
          className="group flex items-baseline gap-2"
          aria-label="Lee Makosso — Home"
        >
          <span className="font-display text-lg font-black uppercase tracking-tight">
            LEEEIGHT
            <span className="text-accent">.</span>
          </span>
          <span className="meta hidden text-muted transition-colors duration-300 group-hover:text-ink sm:inline">
            <Trans>Folio ©2026</Trans>
          </span>
        </Link>

        {/* Current section indicator */}
        <span className="meta absolute left-1/2 hidden -translate-x-1/2 text-muted md:inline">
          Sec. {section}
          <span className="mx-2 text-line-strong">/</span>
          {pathname === "/" ? (
            <Trans>Home</Trans>
          ) : pathname.startsWith("/projects") ? (
            <Trans>Works</Trans>
          ) : pathname === "/about" ? (
            <Trans>Profile</Trans>
          ) : (
            <Trans>Contact</Trans>
          )}
        </span>

        {/* Right cluster */}
        <div className="flex items-center gap-3 md:gap-5">
          <DakarClock />
          <ThemeToggle />
          <LanguageDial />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="group flex h-9 items-center gap-2.5 border border-ink bg-ink px-3.5 text-paper transition-colors duration-300 hover:bg-transparent hover:text-ink"
          >
            <span className="meta">{isOpen ? <Trans>Close</Trans> : <Trans>Index</Trans>}</span>
            <span className="relative flex h-2 w-4 flex-col justify-between">
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${
                  isOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${
                  isOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
