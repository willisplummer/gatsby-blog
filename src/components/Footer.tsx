import React from 'react';

import { rhythm } from '../utils/typography';

const Footer = (): JSX.Element => (
  <footer
    style={{
      marginTop: rhythm(2.5),
      paddingTop: rhythm(1),
    }}
  >
    <div style={{ float: 'right' }}>
      <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
        rss
      </a>
    </div>
    <a
      href="https://github.com/willisplummer"
      target="_blank"
      rel="noopener noreferrer"
    >
      github
    </a>{' '}
    <a
      href="https://willisplummer.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      website
    </a>{' '}
  </footer>
);

export default Footer;
