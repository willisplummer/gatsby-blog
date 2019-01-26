import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';

interface PropsType {
  location: { pathname: string };
  data: { site: { siteMetadata: { title: string } } };
}

const Confirm = ({
  location,
  data: {
    site: {
      siteMetadata: { title: siteTitle },
    },
  },
}: PropsType): JSX.Element => (
  <Layout location={location} title={siteTitle}>
    <main>
      <h1>Just one more thing...</h1>
      <p>
        Thank you for subscribing. You will need to check your inbox and confirm
        your subscription.
      </p>
    </main>
  </Layout>
);

export const pageQuery = graphql`
  query ConfirmSiteData {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default Confirm;
