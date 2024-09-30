import { Modal as AriaModal, ModalOverlayProps } from 'react-aria-components';
import './index.css';

export function Modal(props: ModalOverlayProps) {
  return <AriaModal {...props} />;
}
