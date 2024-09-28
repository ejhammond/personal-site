'use client';

import { darkTheme, Provider } from '@adobe/react-spectrum';

export default function SpectrumRoot(
  props: React.ComponentProps<typeof Provider>,
) {
  return <Provider theme={darkTheme} {...props} />;
}
