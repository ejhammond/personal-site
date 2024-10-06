import React, { Suspense } from 'react';
import './page.css';
import { VStack } from '@/ds/v-stack';
import Content from './__private__/content';

export default function Mortgage() {
  return (
    <VStack gap="md">
      <h2>Mortgage Calculator</h2>
      <Suspense>
        <Content />
      </Suspense>
    </VStack>
  );
}
