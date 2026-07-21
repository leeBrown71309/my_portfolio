import { i18n } from "@lingui/core";
// @ts-ignore
import { messages as enMessages } from "./locales/en/messages.po";

export { i18n };

export const locales = {
  en: "English",
  fr: "Français",
};

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = "en";

// Load and activate default locale immediately for SSR
i18n.load(defaultLocale, enMessages);
i18n.activate(defaultLocale);

export async function dynamicActivate(locale: string) {
  if (locale === defaultLocale) {
    i18n.load(defaultLocale, enMessages);
    i18n.activate(defaultLocale);
    return;
  }
  // @ts-ignore
  const { messages } = await import(`./locales/${locale}/messages.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
