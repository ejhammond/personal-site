/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui';
import { MDXProvider } from '@mdx-js/react';

import Prism from '@theme-ui/prism';

import Header from './header';
import theme from '../theme-ui';

const mdxComponents = {
  code: Prism,
};

const Layout: React.FC = ({ children }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <ThemeProvider theme={theme}>
        <Header />
        <div
          sx={{
            mx: 'auto',
            maxWidth: '900px',
            px: 3,
            pb: 4,
          }}
        >
          <main>{children}</main>
        </div>
      </ThemeProvider>
    </MDXProvider>
  );
};

export default Layout;
