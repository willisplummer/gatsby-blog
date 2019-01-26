// This is kind of a mess for some languages.
// Try to be as short as possible.
// Make sure you use a real code (e.g. "ja", not "jp").
// Some resources:
// http://www.rfc-editor.org/rfc/bcp/bcp47.txt
// https://www.w3.org/International/articles/language-tags/
// https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
// https://discuss.httparchive.org/t/what-are-the-invalid-uses-of-the-lang-attribute/1022

// Please keep keys lowercase!
export const codeToLanguage = (code: string): string => {
  const languageMap: { [s: string]: string } = {
    en: 'English',
    ru: 'Русский',
    tr: 'Türkçe',
    es: 'Español',
    ko: '한국어',
    sv: 'Svenska',
    it: 'Italiano',
    'pt-br': 'Português do Brasil',
    pl: 'Polski',
    'zh-hant': '文言',
    ja: '日本語',
    fr: 'Français',
    hu: 'Magyar',
    vi: 'Tiếng Việt',
    th: 'ไทย',
  };

  return languageMap[code];
};

export const loadFontsForCode = (code: string) => {
  switch (code) {
    case 'ru':
    case 'bg':
    case 'uk':
    case 'cs':
    case 'da':
    case 'de':
    case 'es':
    case 'fi':
    case 'fr':
    case 'hu':
    case 'it':
    case 'nl':
    case 'no':
    case 'pl':
    case 'pt-br':
    case 'sq':
    case 'sv':
    case 'tr':
    case 'vi':
    default:
      break;
  }
};

export const createLanguageLink = (
  slug: string,
  lang: string
): (targetLang: string) => string => {
  const rawSlug = slug.replace(`${lang}/`, '');

  return targetLang =>
    targetLang === 'en' ? rawSlug : `${targetLang}/${rawSlug}`;
};
