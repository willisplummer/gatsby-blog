import React from 'react';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import { formatReadingTime } from '../utils/helpers';
import { rhythm } from '../utils/typography';

interface PostType {
  node: {
    fields: {
      title: string;
      langKey: string;
      slug: string;
    };
    frontmatter: { date: string; spoiler: string };
    timeToRead: number;
  };
}

interface PropsType {
  location: { pathname: string };
  data: any;
}

const BlogIndex = ({ data, location }: PropsType): JSX.Element => {
  const siteTitle: string = get(data, 'site.siteMetadata.title', '');
  const posts: PostType[] = get(data, 'allMarkdownRemark.edges').filter(
    ({ node }: PostType) => node.fields.langKey === 'en',
  );

  return (
    <Layout location={location} title={siteTitle}>
      <SEO meta={[]} />
      <Bio />
      {posts.map(({ node }: PostType) => {
        const title = get(node, 'frontmatter.title') || node.fields.slug;
        return (
          <div key={node.fields.slug}>
            <h3
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: rhythm(1),
                marginBottom: rhythm(1 / 4),
              }}
            >
              <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                {title}
              </Link>
            </h3>
            <small>
              {node.frontmatter.date}
              {` • ${formatReadingTime(node.timeToRead)}`}
            </small>
            <p dangerouslySetInnerHTML={{ __html: node.frontmatter.spoiler }} />
          </div>
        );
      })}
      <Footer />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
            langKey
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
          }
        }
      }
    }
  }
`;
