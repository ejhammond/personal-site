import { Icon } from '@astryxdesign/core/Icon';
import { Link } from '@astryxdesign/core/Link';
import { HStack } from '@astryxdesign/core/Stack';

/**
 * The back link used at the top of sub-pages ("← Back", "← All mortgages",
 * ...). Same treatment everywhere: a secondary-colour link with a chevron,
 * pointing at the parent page. Works in Server Components: the chevron is
 * a built-in glyph name (a string), not a component type.
 */
export function BackLink({
  href,
  label = 'Back',
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link href={href} color="secondary">
      <HStack gap={1} vAlign="center">
        <Icon icon="chevronLeft" size="sm" color="inherit" />
        {label}
      </HStack>
    </Link>
  );
}
