import { useEffect, useState } from "react";

interface ViewportSize {
  width: number;
  height: number;
}

const UNMEASURED: ViewportSize = { width: 0, height: 0 };

/** Only ever called from an effect, so `window` is guaranteed. */
const readViewport = (): ViewportSize => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

/**
 * The viewport's pixel size, kept in sync with resizes. Reports zeroes until
 * the first effect runs; callers should treat that as "not measured yet".
 *
 * State is the right tool here even though continuous values belong on motion
 * values: a resize is a discrete, rare event, and callers need the number at
 * render time to build keyframes from it.
 *
 * The initial state is deliberately zero rather than a `typeof window` read.
 * Reading the real size during the first render makes the client disagree with
 * the server, and React does not patch mismatched attributes up on hydration —
 * a consumer writing an inline `width` would keep the server's value until some
 * unrelated re-render happened to rewrite it. Starting both sides at zero keeps
 * hydration clean and lets the effect below deliver the real size.
 */
export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(UNMEASURED);

  useEffect(() => {
    // Bail when the numbers are unchanged. `resize` fires for things that do
    // not move these values (scrollbar toggles, devtools docking), and every
    // committed update re-renders consumers — which, for a consumer driving a
    // WebGL canvas, means re-configuring the renderer for nothing.
    const commit = () =>
      setSize((current) => {
        const next = readViewport();
        return next.width === current.width && next.height === current.height
          ? current
          : next;
      });
    // Run once on mount: the state starts unmeasured by design, so this is what
    // delivers the first real size.
    commit();
    // Then re-read on the next frame. A hidden or freshly created browsing
    // context can report 0 at mount and never fire a resize once it gets its
    // real size — and because the bail above treats an unchanged read as a
    // no-op, that would otherwise leave consumers permanently unmeasured.
    const retry = requestAnimationFrame(commit);
    window.addEventListener("resize", commit, { passive: true });
    return () => {
      cancelAnimationFrame(retry);
      window.removeEventListener("resize", commit);
    };
  }, []);

  return size;
}
