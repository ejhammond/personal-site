import {
  ColorArea as AriaColorArea,
  ColorAreaProps,
  ColorThumb,
} from 'react-aria-components';

import './index.css';

export function ColorArea(props: ColorAreaProps) {
  return (
    <AriaColorArea {...props}>
      <ColorThumb />
    </AriaColorArea>
  );
}
