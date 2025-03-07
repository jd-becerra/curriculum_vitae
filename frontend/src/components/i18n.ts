import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";

function loadLocaleMessages() {
  const locales: { [key: string]: object }[] = [
    { en: en },
    { es: es }
  ];
  const messages: { [key: string]: any } = {};
  locales.forEach((lang) => {
    const key = Object.keys(lang)[0];
    messages[key] = lang[key];
  });
  return messages;
}
export default createI18n({
  locale: "en",
  fallbackLocale: "en",
  warnHtmlMessage: false,
  legacy: false,
  messages: loadLocaleMessages()
});
