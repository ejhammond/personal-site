'use client';

import { useState } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { NumberInput } from '@astryxdesign/core/NumberInput';

// Interactive counter demo for the redux-minus-react article, which renders
// it with no props. Replaces the old ds Counter (a stepper NumberField).
// The article describes a counter displaying its current value, so it
// starts at 0; the old one rendered empty (no value prop was passed).
export function MdxCounter() {
  const [value, setValue] = useState(0);
  return (
    <Card variant="muted">
      <NumberInput
        label="Counter"
        isLabelHidden
        value={value}
        onChange={setValue}
        hasNumberSteppers
        width={150}
      />
    </Card>
  );
}
