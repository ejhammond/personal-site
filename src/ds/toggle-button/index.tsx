import {
  ToggleButton as AriaToggleButton,
  ToggleButtonProps,
} from 'react-aria-components';
import './index.css';

export function ToggleButton(props: ToggleButtonProps) {
  return <AriaToggleButton {...props} />;
}
