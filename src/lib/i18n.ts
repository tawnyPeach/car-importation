import translations from "@/data/translations.json";
import countries from "@/data/countries.json";

export type Lang = "en" | "fr";

type TranslationObject = Record<string, unknown>;

export function getTranslation(lang: Lang, key: string): string {
  const keys = key.split(".");
  let result: unknown = translations[lang];

  for (const k of keys) {
    if (result && typeof result === "object" && k in (result as TranslationObject)) {
      result = (result as TranslationObject)[k];
    } else {
      return key;
    }
  }

  return typeof result === "string" ? result : key;
}

export function getCountrySlug(countrySlug: string, lang: Lang): string {
  const country = countries.find((c) => c.slug === countrySlug);
  if (!country) return countrySlug;

  if (lang === "fr") {
    return country.localName;
  }

  return country.slug;
}

export function getSupportedLanguages(): Lang[] {
  return ["en", "fr"];
}

export function getDefaultLanguage(): Lang {
  return "en";
}
