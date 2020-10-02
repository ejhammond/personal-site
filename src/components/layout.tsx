/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui';
import * as React from 'react';
import { MDXProvider } from '@mdx-js/react';

import Prism from '@theme-ui/prism';

import Header from './header';
import { Bio } from './bio';
import { BoundedContent } from './bounded-content';
import theme from '../theme-ui';

const mdxComponents = {
  code: Prism,
};

const Layout: React.FC = ({ children }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <ThemeProvider theme={theme}>
        <Header />
        <BoundedContent>
          <main sx={{ mb: 5 }}>{children}</main>
        </BoundedContent>
      </ThemeProvider>
    </MDXProvider>
  );
};

export default Layout;
