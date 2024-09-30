import { Form as AriaForm, FormProps } from 'react-aria-components';
import './index.css';

export function Form(props: FormProps) {
  return <AriaForm {...props} />;
}
