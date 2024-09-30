import { Dialog as AriaDialog, DialogProps } from 'react-aria-components';
import './index.css';

export function Dialog(props: DialogProps) {
  return <AriaDialog {...props} />;
}
