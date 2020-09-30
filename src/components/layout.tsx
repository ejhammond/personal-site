/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui';
import { MDXProvider } from '@mdx-js/react';

import Prism from '@theme-ui/prism';

import Header from './header';
import { Bio } from './bio';
import { BoundedContent } from './bounded-content';
import theme from '../theme-ui';

const mdxComponents = {
  code: Prism,
};

const NoGrow: React.FC = (props) => <div sx={{ flexGrow: 0 }} {...props} />;
const Grow: React.FC = (props) => <div sx={{ flexGrow: 1 }} {...props} />;

const Layout: React.FC = ({ children }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <ThemeProvider theme={theme}>
        <div sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NoGrow>
            <Header />
          </NoGrow>
          <Grow>
            <BoundedContent>
              <main sx={{ mb: 4 }}>{children}</main>
            </BoundedContent>
          </Grow>
          <NoGrow>
            <footer sx={{ backgroundColor: 'primary', color: 'white', py: 4 }}>
              <BoundedContent>
                <Bio />
              </BoundedContent>
            </footer>
          </NoGrow>
        </div>
      </ThemeProvider>
    </MDXProvider>
  );
};

export default Layout;
