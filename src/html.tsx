import React from 'react';

interface PropsType {
  htmlAttributes: Record<string, any>;
  headComponents: any[];
  bodyAttributes: Record<string, any>;
  preBodyComponents: any[];
  body: string;
  postBodyComponents: any[];
}

const HTML = ({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  postBodyComponents,
  body,
}: PropsType): JSX.Element => (
  <html lang="en-US" {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {headComponents}
    </head>
    <body {...bodyAttributes} className="light">
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          (function() {
            window.onThemeChange = function() {};
            function setTheme(newTheme) {
              window.theme = newTheme;
              preferredTheme = newTheme;
              document.body.className = newTheme;
              window.onThemeChange(newTheme);
            }

            var preferredTheme;
            try {
              preferredTheme = localStorage.getItem('theme');
            } catch (err) { }

            window.setPreferredTheme = function(newTheme) {
              setTheme(newTheme);
              try {
                localStorage.setItem('theme', newTheme);
              } catch (err) {}
            }

            var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkQuery.addListener(function(e) {
              window.setPreferredTheme(e.matches ? 'dark' : 'light')
            });

            setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
          })();
        `,
        }}
      />
      {preBodyComponents}
      <div
        key="body"
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {postBodyComponents}
    </body>
  </html>
);

export default HTML;
