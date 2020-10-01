/** @jsx jsx */
import { Link as ThemeUILink, jsx } from 'theme-ui';
import { Link as GatsbyLink } from 'gatsby';

type ThemeUILinkProps = React.ComponentPropsWithoutRef<typeof ThemeUILink>;
type GatsbyLinkProps = React.ComponentPropsWithoutRef<typeof GatsbyLink>;
type LinkProps = Omit<ThemeUILinkProps & GatsbyLinkProps, 'as'>;

export const Link: React.FC<LinkProps> = (props) => {
  return <ThemeUILink as={GatsbyLink} {...props} />;
};
