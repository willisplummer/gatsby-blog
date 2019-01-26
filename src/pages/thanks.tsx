import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';

interface PropsType {
  location: { pathname: string };
  data: {
    site: { siteMetadata: { title: string } };
  };
}

const Thanks = ({
  location,
  data: {
    site: {
      siteMetadata: { title: siteTitle },
    },
  },
}: PropsType): JSX.Element => (
  <Layout location={location} title={siteTitle}>
    <main>
      <h1>Thank you for subscribing.</h1>
      <p>
        You are now confirmed. You can expect to receive emails as I create new
        content.
      </p>
    </main>
  </Layout>
);

export const pageQuery = graphql`
  query ThanksSiteData {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default Thanks;
