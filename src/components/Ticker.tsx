import type { ReactNode } from "react";

interface TickerProps {
  children: ReactNode;
  className?: string;
  slow?: boolean;
}

/**
 * Seamless marquee. Content is duplicated; the track translates -50%.
 */
export function Ticker({ children, className = "", slow = false }: TickerProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`ticker-track ${slow ? "slow" : ""}`}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {children}
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
