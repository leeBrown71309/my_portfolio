import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { msg } from "@lingui/macro";
import { I18nProvider } from "@lingui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { i18n } from "../i18n";
import appCss from "../styles.css?url";
import { MenuProvider } from "../context/MenuContext";
import { Header } from "../components/Header";
import { MenuOverlay } from "../components/MenuOverlay";
import { BottomBar } from "../components/BottomBar";
import { NotFound } from "../components/NotFound";
import { Loader } from "../components/Loader";
import { CustomCursor } from "../components/CustomCursor";
import { THEME_BOOT_SCRIPT } from "../hooks/useIsDark";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: i18n._(msg`LEEEIGHT. — Creative Developer Portfolio`) },
      {
        name: "description",
        content: i18n._(
          msg`Portfolio of Lee Makosso, a creative developer and UI/UX designer sculpting digital interfaces where aesthetics meet performance.`,
        ),
      },
      { property: "og:title", content: i18n._(msg`LEEEIGHT. — Creative Developer Portfolio`) },
      {
        property: "og:description",
        content: i18n._(
          msg`Next-generation web development with premium aesthetics and performance.`,
        ),
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [{ children: THEME_BOOT_SCRIPT }],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!i18n.locale) {
      i18n.activate("en");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang={i18n.locale || "en"}>
      <head>
        <HeadContent />
      </head>
      <body className="grain">
        <I18nProvider i18n={i18n}>
          <MenuProvider>
            <Loader />
            <CustomCursor />
            <Header />
            <MenuOverlay />
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
                animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeOut" } }}
                transition={{ duration: 0.65, ease: [0.83, 0, 0.17, 1] }}
                className="relative z-10 min-h-[100dvh] pt-16"
              >
                <Outlet />
                <BottomBar />
              </motion.main>
            </AnimatePresence>
          </MenuProvider>
        </I18nProvider>
        <Scripts />
      </body>
    </html>
  );
}
