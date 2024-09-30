import { Toolbar as AriaToolbar, ToolbarProps } from 'react-aria-components';
import './index.css';

export function Toolbar(props: ToolbarProps) {
  return <AriaToolbar {...props} />;
}
