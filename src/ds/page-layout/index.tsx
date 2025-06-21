import cx from '@/utils/cx';
import './index.css';
import { SiteBreadcrumbs } from '@/components/site-breadcrumbs';
import { isNonEmptyNode } from '@/utils/isNonEmptyNode';

export function PageLayout({
  header,
  leftPanel,
  rightPanel,
  children,
  type = 'editorial',
}: Readonly<{
  header: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
  type?: 'editorial' | 'form' | 'table';
}>) {
  return (
    <div className="page-layout">
      {header}
      <div className="panel-layout">
        {leftPanel}
        <main
          className={cx(
            type === 'editorial' && 'width-editorial',
            type === 'form' && 'width-form',
            // type: table is full width
          )}
        >
          {children}
        </main>
        {rightPanel}
      </div>
    </div>
  );
}

export function PageLayoutHeader({
  title,
  subtitle,
  endContent,
}: Readonly<{
  title: string;
  subtitle?: string;
  endContent?: React.ReactNode;
}>) {
  return (
    <header>
      <div>
        <SiteBreadcrumbs />
        <h1>{title}</h1>
        <small>{subtitle}</small>
      </div>
      {endContent}
    </header>
  );
}

export function PageLayoutPanel({
  children,
  side,
  header,
  footer,
}: Readonly<{
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  side: 'left' | 'right';
}>) {
  return (
    <aside className={cx(`side-${side}`)}>
      {isNonEmptyNode(header) && header}
      <section>{children}</section>
      {isNonEmptyNode(footer) && footer}
    </aside>
  );
}

export function PageLayoutPanelHeader({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <header>{children}</header>;
}

export function PageLayoutPanelFooter({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <footer>{children}</footer>;
}
