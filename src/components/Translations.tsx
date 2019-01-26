import React from 'react';
import { Link } from 'gatsby';
import systemFont from '../constants/system-font';
import { codeToLanguage } from '../utils/i18n';

interface TranslationsPropsType {
  translations: string[];
  lang: string;
  languageLink(code: string): string;
  editUrl: string;
}

const Translations = ({
  translations,
  lang,
  languageLink,
  editUrl,
}: TranslationsPropsType): JSX.Element => (
  <p
    style={{
      fontSize: '0.9em',
      border: '1px solid var(--hr)',
      borderRadius: '0.75em',
      padding: '0.75em',
      background: 'var(--inlineCode-bg)',
      // Use system font to avoid loading extra glyphs for language names
      fontFamily: systemFont,
    }}
  >
    {translations.length > 0 && (
      <span>
        <span>Translations by readers: </span>
        {translations.map((l: string, i: number) => (
          <React.Fragment key={l}>
            {l === lang ? (
              <b>{codeToLanguage(l)}</b>
            ) : (
              <Link to={languageLink(l)}>{codeToLanguage(l)}</Link>
            )}
            {i === translations.length - 1 ? '' : ' • '}
          </React.Fragment>
        ))}
      </span>
    )}
    {lang !== 'en' && (
      <>
        <br />
        <br />
        <Link to={languageLink('en')}>Read</Link>
        {' the original or '}
        <a href={editUrl} target="_blank" rel="noopener noreferrer">
          improve
        </a>{' '}
        this translation.
      </>
    )}
  </p>
);

export default Translations;
