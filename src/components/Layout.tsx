/* global __PATH_PREFIX__ */

import React from 'react';
import { Link } from 'gatsby';
// @ts-ignore
import Toggle from './Toggle';

import { rhythm, scale } from '../utils/typography';
import * as sun from '../assets/sun.png';
import * as moon from '../assets/moon.png';

// @ts-ignore
const rootPath = `${__PATH_PREFIX__}/`;

interface PropsType {
  location: { pathname: string };
  title: string;
}

interface StateType {
  theme: string | null;
}

declare global {
  interface Window {
    onThemeChange: any;
    theme: any;
    setPreferredTheme: any;
  }
}

class Layout extends React.Component<PropsType, StateType> {
  state = {
    theme: null,
  };

  componentDidMount(): void {
    this.setState({ theme: window.theme });
    window.onThemeChange = () => {
      this.setState({ theme: window.theme });
    };
  }

  renderHeader(): JSX.Element {
    const { location, title } = this.props;

    if (location.pathname === rootPath) {
      return (
        <h1
          style={{
            ...scale(0.75),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'var(--textTitle)',
            }}
            to="/"
          >
            {title}
          </Link>
        </h1>
      );
    }
    return (
      <h3
        style={{
          fontFamily: 'Montserrat, sans-serif',
          marginTop: 0,
          marginBottom: rhythm(-1),
          minHeight: '3.5rem',
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'rgb(255, 167, 196)',
          }}
          to="/"
        >
          {title}
        </Link>
      </h3>
    );
  }

  render(): JSX.Element {
    console.log(window);
    const { children, location } = this.props;
    const { theme } = this.state;
    const isHomePage = location.pathname === rootPath;
    // Keep dark/light mode switch aligned between home and post page
    // Does this make sense? No.
    const topPadding = isHomePage ? rhythm(1.5) : rhythm(1.8);

    return (
      <div
        style={{
          color: 'var(--textNormal)',
          background: 'var(--bg)',
          transition: 'color 0.2s ease-out, background 0.2s ease-out',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `${topPadding} ${rhythm(3 / 4)}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            {this.renderHeader()}
            {theme !== null ? (
              <Toggle
                icons={{
                  checked: (
                    <img
                      src={moon}
                      alt="dark mode"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                  unchecked: (
                    <img
                      src={sun}
                      alt="light mode"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                }}
                checked={theme === 'dark'}
                onChange={(e: any) =>
                  window.setPreferredTheme(e.target.checked ? 'dark' : 'light')
                }
              />
            ) : (
              <div style={{ height: '24px' }} />
            )}
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;
