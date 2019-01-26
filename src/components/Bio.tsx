import React from 'react';
import profilePic from '../assets/profile-pic.jpg';
import { rhythm } from '../utils/typography';

const Bio = (): JSX.Element => (
  <div
    style={{
      display: 'flex',
      marginBottom: rhythm(2),
    }}
  >
    <img
      src={profilePic}
      alt="Willis Plummer"
      style={{
        marginRight: rhythm(1 / 2),
        marginBottom: 0,
        width: rhythm(2),
        height: rhythm(2),
        borderRadius: '50%',
      }}
    />
    <p style={{ maxWidth: 310 }}>
      Personal blog by{' '}
      <a href="https://github.com/willisplummer">Willis Plummer</a>. dedicated,
      in respect and admiration, to the spirit that lives in the computer
    </p>
  </div>
);

export default Bio;
