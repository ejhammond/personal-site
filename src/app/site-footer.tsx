import { Link } from '@astryxdesign/core/Link';
import { HStack, StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

/**
 * Site footer, rendered in the footer slot of every page's Layout so it
 * sits at the bottom of the viewport on short pages.
 */
export function SiteFooter() {
  return (
    <HStack gap={2} vAlign="center">
      <Text type="supporting" color="secondary">
        © 2026 EJ Hammond
      </Text>
      <StackItem size="fill" />
      <Link
        href="https://github.com/ejhammond/personal-site"
        color="secondary"
      >
        Source on GitHub
      </Link>
    </HStack>
  );
}
