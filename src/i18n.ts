import { i18n } from "@lingui/core";
// @ts-ignore
import { messages as frMessages } from "./locales/fr/messages.po";

export { i18n };

export const locales = {
  en: "English",
  fr: "Français",
};

export const defaultLocale = "fr";

// Load and activate default locale immediately for SSR
i18n.load(defaultLocale, frMessages);
i18n.activate(defaultLocale);

export async function dynamicActivate(locale: string) {
  if (locale === "fr") {
    i18n.load("fr", frMessages);
    i18n.activate("fr");
    return;
  }
  // @ts-ignore
  const { messages } = await import(`./locales/${locale}/messages.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
