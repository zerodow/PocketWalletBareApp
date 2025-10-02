import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// if English isn't your default language, move Translations to the appropriate language file.
import en, { Translations } from './en';
import vi from './vi';

const fallbackLocale = 'en-US';

const systemLocales = RNLocalize.getLocales();

const resources = { en, vi };
const supportedTags = Object.keys(resources);

// Checks to see if the device locale matches any of the supported locales
// Device locale may be more specific and still match (e.g., en-US matches en)
const systemTagMatchesSupportedTags = (deviceTag: string) => {
  const primaryTag = deviceTag.split('-')[0];
  return supportedTags.includes(primaryTag);
};

const pickSupportedLocale: () => RNLocalize.Locale | undefined = () => {
  return systemLocales.find(locale =>
    systemTagMatchesSupportedTags(locale.languageTag),
  );
};

const locale = pickSupportedLocale();

export let isRTL = false;

// Need to set RTL ASAP to ensure the app is rendered correctly. Waiting for i18n to init is too late.
if (locale?.languageTag && locale?.isRTL) {
  I18nManager.allowRTL(true);
  isRTL = true;
} else {
  I18nManager.allowRTL(false);
}

export const initI18n = async () => {
  i18n.use(initReactI18next);

  await i18n.init({
    resources,
    lng: locale?.languageTag ?? fallbackLocale,
    fallbackLng: fallbackLocale,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
};

// Re-export the i18n instance for runtime language switching
export { i18n };

/**
 * Builds up valid keypaths for translations.
 */

export type TxKeyPath = RecursiveKeyOf<Translations>;

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`,
    true
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`,
    false
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
  IsFirstLevel extends boolean,
> = TValue extends any[]
  ? Text
  : TValue extends object
  ? IsFirstLevel extends true
    ? Text | `${Text}:${RecursiveKeyOfInner<TValue>}`
    : Text | `${Text}.${RecursiveKeyOfInner<TValue>}`
  : Text;
