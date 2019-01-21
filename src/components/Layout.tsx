import React from 'react';
import { Link } from 'gatsby';
// @ts-ignore
import Toggle from './Toggle';

import { rhythm, scale } from '../utils/typography';
import * as sun from '../assets/sun.png';
import * as moon from '../assets/moon.png';

type PropsType = {
  location: { pathname: string },
  title: string,
}

type StateType = {
  theme: string | null
}

declare global {
  interface Window { __onThemeChange: any, __theme: any, __setPreferredTheme: any }
}


class Layout extends React.Component<PropsType, StateType> {
  state = {
    theme: null,
  };
  componentDidMount() {
    this.setState({ theme: window.__theme });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
  }
  renderHeader() {
    const { location, title } = this.props;
    // @ts-ignore
    const rootPath = `${__PATH_PREFIX__}/`;

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
            to={'/'}
          >
            {title}
          </Link>
        </h1>
      );
    } else {
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
            to={'/'}
          >
            {title}
          </Link>
        </h3>
      );
    }
  }
  render() {
    const { children, location } = this.props;
    // @ts-ignore
    const rootPath: string = `${__PATH_PREFIX__}/`;
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
            {this.state.theme !== null ? (
              <Toggle
                icons={{
                  checked: (
                    <img
                      src={moon}
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                  unchecked: (
                    <img
                      src={sun}
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                }}
                checked={this.state.theme === 'dark'}
                onChange={(e: any) =>
                  window.__setPreferredTheme(
                    e.target.checked ? 'dark' : 'light'
                  )
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
