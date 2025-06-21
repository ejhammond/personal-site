import { Link } from '../link';
import './index.css';

export function Breadcrumbs({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <nav className="breadcrumbs">
      <ol>{children}</ol>
    </nav>
  );
}

export function Breadcrumb({
  children,
  href,
}: Readonly<{ children: React.ReactNode; href?: string }>) {
  return (
    <li className="breadcrumb">
      <Link href={href}>{children}</Link>
    </li>
  );
}
