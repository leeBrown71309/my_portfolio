import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { msg, Trans } from "@lingui/macro";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { I18nProvider } from "@lingui/react";
import { i18n } from "../i18n";
import { useEffect } from "react";
import AOS from "aos";
import aosCss from "aos/dist/aos.css?url";
import appCss from "../styles.css?url";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Loader } from "../components/Loader";
import { LoadingProvider } from "../context/LoadingContext";
import { NotFound } from "../components/NotFound";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: i18n._(msg`LEEEIGHT. | Portfolio de Développeur Créatif`),
      },
      {
        name: "description",
        content: i18n._(
          msg`Portfolio professionnel d'un développeur créatif spécialisé en React, TanStack et animations haut de gamme.`,
        ),
      },
      // Social Meta
      {
        property: "og:title",
        content: i18n._(msg`LEEEIGHT. | Portfolio de Développeur Créatif`),
      },
      {
        property: "og:description",
        content: i18n._(
          msg`Découvrez le développement web de nouvelle génération avec une esthétique et des performances premium.`,
        ),
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: aosCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    // Activation de la langue par défaut si nécessaire
    if (!i18n.locale) {
      i18n.activate("fr");
    }
  }, []);

  return (
    <html lang={i18n.locale || "fr"}>
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nProvider i18n={i18n}>
          <LoadingProvider>
            <Loader />
            <CustomCursor />
            <LanguageSwitcher />
            <Navbar />
            <main className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#070b14] selection:bg-primary-500/30 selection:text-primary-100 font-sans transition-colors duration-700">
              <Outlet />
            </main>
          </LoadingProvider>
        </I18nProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
