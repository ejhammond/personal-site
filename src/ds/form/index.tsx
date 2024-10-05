import { FormProps } from 'react-aria-components';
import './index.css';

export function Form({
  children,
  footer,
  ...delegatedProps
}: FormProps & { footer?: React.ReactNode }) {
  // React Aria form's onSubmit gets tangled up with other forms on the same
  // page for some reason, so we just use a regular form here.
  return (
    <form className="react-aria-Form" {...delegatedProps}>
      <div className="fields">{children}</div>
      <div className="footer">{footer}</div>
    </form>
  );
}
