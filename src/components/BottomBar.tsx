import { Trans } from "@lingui/macro";
import { socials } from "../data/about";

/**
 * Global legal bar rendered at the bottom of every page.
 */
export function BottomBar() {
  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
      <span className="meta text-muted">© 2026 Lee Makosso</span>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="meta u-link text-muted transition-colors hover:text-ink"
          >
            {s.label}
          </a>
        ))}
      </div>
      <span className="meta text-muted">
        <Trans>Dakar — 14.7167°N, 17.4677°W</Trans>
      </span>
    </div>
  );
}
