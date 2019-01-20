import React from 'react';
import Layout from '../components/Layout';
import get from 'lodash/get';
import { graphql } from 'gatsby';

type PropsType = {
  location: any,
  data: any,
}

const Thanks = (props: PropsType): JSX.Element => {
  const siteTitle = get(props, 'data.site.siteMetadata.title');
  return (
    <Layout location={props.location} title={siteTitle}>
      <h1>Thank you for subscribing.</h1>
      <p>
        You are now confirmed. You can expect to receive emails as I create
        new content.
      </p>
    </Layout>
  );
}

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
