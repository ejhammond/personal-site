/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui';
import { MDXProvider } from '@mdx-js/react';

import Prism from '@theme-ui/prism';

import Header from './header';
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
          <main sx={{ pb: 4 }}>{children}</main>
        </BoundedContent>
      </ThemeProvider>
    </MDXProvider>
  );
};

export default Layout;
