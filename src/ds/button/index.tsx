import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import './index.css';

export function Button(props: ButtonProps) {
  return <AriaButton {...props} />;
}
