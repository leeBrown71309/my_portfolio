import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$§*+=/<>_";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** ms between frames */
  interval?: number;
  /** characters resolved per frame */
  speed?: number;
  /** disable the mount animation (SSR text stays intact) */
  playOnMount?: boolean;
}

/**
 * Renders text that "decodes" itself: unresolved characters cycle through
 * random glyphs, resolving left to right. Re-runs whenever `text` changes
 * (e.g. on language switch).
 */
export function ScrambleText({
  text,
  className,
  interval = 28,
  speed = 0.6,
  playOnMount = true,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<number | undefined>(undefined);
  const mounted = useRef(false);

  useEffect(() => {
    const skip = !playOnMount && !mounted.current;
    mounted.current = true;
    if (skip) {
      setDisplay(text);
      return;
    }

    let progress = 0;
    const step = () => {
      progress += speed;
      const resolved = Math.floor(progress);
      if (resolved >= text.length) {
        setDisplay(text);
        return;
      }
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out +=
          ch === " " || i < resolved
            ? ch
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      timer.current = window.setTimeout(step, interval);
    };
    step();
    return () => window.clearTimeout(timer.current);
  }, [text, interval, speed, playOnMount]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}

/**
 * Link label that scrambles on hover.
 */
export function HoverScramble({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const scramble = () => {
    window.clearTimeout(timer.current);
    let progress = 0;
    const step = () => {
      progress += 0.8;
      const resolved = Math.floor(progress);
      if (resolved >= text.length) {
        setDisplay(text);
        return;
      }
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out +=
          ch === " " || i < resolved
            ? ch
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      timer.current = window.setTimeout(step, 24);
    };
    step();
  };

  return (
    <span className={className} onMouseEnter={scramble} aria-label={text}>
      {display}
    </span>
  );
}
