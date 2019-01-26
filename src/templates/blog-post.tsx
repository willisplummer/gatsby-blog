import React from 'react';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';

import '../fonts/fonts-post.css';
import Bio from '../components/Bio';
import Translations from '../components/Translations';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
// import Signup from '../components/Signup';
import systemFont from '../constants/system-font';
import { formatReadingTime } from '../utils/helpers';
import { rhythm, scale } from '../utils/typography';
import {
  codeToLanguage,
  createLanguageLink,
  loadFontsForCode,
} from '../utils/i18n';

const GITHUB_USERNAME = 'willisplummer';
const GITHUB_REPO_NAME = 'gatsby-blog';

interface PageDataType {
  html: string;
  timeToRead: number;
  fields: { langKey: string; slug: string };
  frontmatter: {
    langs: string[];
    title: string;
    date: string;
    spoiler: string;
  };
}

interface PropsType {
  data: {
    markdownRemark: PageDataType;
  };
  pageContext: { previous?: PageDataType; next?: PageDataType; slug: string };
  location: { pathname: string };
}

const BlogPostTemplate = ({
  data,
  pageContext: { previous, next, slug },
  location,
}: PropsType): JSX.Element => {
  const post = data.markdownRemark;
  const siteTitle = get(data, 'site.siteMetadata.title');
  const lang = post.fields.langKey;
  const translations = (post.frontmatter.langs || []).filter(
    (l: string) => l !== 'en',
  );
  translations.sort((a: string, b: string) =>
    codeToLanguage(a) < codeToLanguage(b) ? -1 : 1,
  );

  loadFontsForCode(lang);
  const languageLink = createLanguageLink(slug, lang);
  const enSlug = languageLink('en');
  const editUrl = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/master/src/pages/${enSlug.slice(
    1,
    enSlug.length - 1,
  )}/index${lang === 'en' ? '' : `.${lang}`}.md`;
  const discussUrl = `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `https://willisplummer.com${enSlug}`,
  )}`;
  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        lang={lang}
        title={post.frontmatter.title}
        description={post.frontmatter.spoiler}
        slug={post.fields.slug}
      />
      <main>
        <article>
          <header>
            <h1 style={{ color: 'var(--textTitle)' }}>
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: 'block',
                marginBottom: rhythm(1),
                marginTop: rhythm(-4 / 5),
              }}
            >
              {post.frontmatter.date}
              {` • ${formatReadingTime(post.timeToRead)}`}
            </p>
            {translations.length > 0 && (
              <Translations
                translations={translations}
                editUrl={editUrl}
                languageLink={languageLink}
                lang={lang}
              />
            )}
          </header>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <footer>
            <p>
              <a href={discussUrl} target="_blank" rel="noopener noreferrer">
                Discuss on Twitter
              </a>
              {` • `}
              <a href={editUrl} target="_blank" rel="noopener noreferrer">
                Edit on GitHub
              </a>
            </p>
          </footer>
        </article>
      </main>
      <aside>
        <div
          style={{
            margin: '90px 0 40px 0',
            fontFamily: systemFont,
          }}
        >
          {/* <Signup /> */}
        </div>
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: rhythm(0.25),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'var(--pink)',
            }}
            to="/"
          >
            {siteTitle}
          </Link>
        </h3>
        <Bio />
        <nav>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        langs
        spoiler
      }
      fields {
        slug
        langKey
      }
    }
  }
`;
