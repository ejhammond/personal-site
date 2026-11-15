import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import type { CSSProperties, ReactNode } from 'react';

// Cap the column at 400px but let it shrink to fit narrow screens (Stack
// has no maxWidth prop, so it's set here).
const contentStyle: CSSProperties = {
  width: '100%',
  maxWidth: 400,
};

/**
 * Shared frame for the auth form pages (log in, sign up, recover, reset):
 * a centered card with a heading, following the Astryx login template.
 */
export function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Layout
      height="fill"
      contentWidth={1200}
      content={
        <LayoutContent padding={8}>
          <Center axis="both" padding={6}>
            <VStack gap={4} style={contentStyle}>
              <Card padding={8} width="100%">
                <VStack gap={4} hAlign="stretch">
                  <VStack gap={1} hAlign="center">
                    <Heading level={2}>{title}</Heading>
                  </VStack>
                  {children}
                </VStack>
              </Card>
            </VStack>
          </Center>
        </LayoutContent>
      }
    />
  );
}
