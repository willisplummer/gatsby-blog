import React from 'react';
import get from 'lodash/get';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';

interface PropsType {
  location: any;
  data: any;
}

const Thanks = ({ location, data }: PropsType): JSX.Element => {
  const siteTitle = get(data, 'site.siteMetadata.title');
  return (
    <Layout location={location} title={siteTitle}>
      <main>
        <h1>Thank you for subscribing.</h1>
        <p>
          You are now confirmed. You can expect to receive emails as I create
          new content.
        </p>
      </main>
    </Layout>
  );
};

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
