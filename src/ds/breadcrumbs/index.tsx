import {
  Breadcrumbs as AriaBreadcrumbs,
  BreadcrumbsProps,
} from 'react-aria-components';
import './index.css';

export function Breadcrumbs<T extends object>(props: BreadcrumbsProps<T>) {
  return <AriaBreadcrumbs {...props} />;
}
