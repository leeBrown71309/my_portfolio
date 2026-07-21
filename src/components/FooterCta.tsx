import { Link } from "@tanstack/react-router";
import { Trans } from "@lingui/macro";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Shared closing section: monumental "Let's talk" heading.
 * Used on every page except /contact.
 */
export function FooterCta() {
  return (
    <section className="border-t border-line px-4 py-20 md:px-8 md:py-32">
      <Reveal>
        <p className="meta mb-6 text-muted">
          <Trans>New business</Trans>
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <Link
          to="/contact"
          className="group flex items-start justify-between gap-4"
          aria-label="Let's talk — go to contact page"
        >
          <span className="font-display text-[15vw] font-black uppercase leading-[0.82] tracking-tight transition-colors duration-500 group-hover:text-accent md:text-[11vw]">
            <Trans>Let's talk</Trans>
          </span>
          <ArrowUpRight
            className="mt-3 h-[9vw] w-[9vw] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-accent md:h-[6vw] md:w-[6vw]"
            strokeWidth={1}
          />
        </Link>
      </Reveal>
    </section>
  );
}
