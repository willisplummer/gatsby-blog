import React from 'react';
import Layout from '../components/Layout';

interface PropsType {
  location: { pathname: string };
}

const NotFoundPage = ({ location }: PropsType): JSX.Element => (
  <Layout title="Willis Plummer Development Blog" location={location}>
    <h1>Not Found</h1>
    <p>I haven’t written this post yet. Will you help me write it?</p>
    <iframe
      title="TODO: delete frankie cosmos"
      width="560"
      height="315"
      src="https://www.youtube.com/embed/6IJB0aD8gSA"
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
    <p>Too doo doo doo doo doo doo doo</p>
  </Layout>
);

export default NotFoundPage;
