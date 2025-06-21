'use client';

import cx from '@/utils/cx';
import './index.css';
import { SiteBreadcrumbs } from '@/components/site-breadcrumbs';
import { isNonEmptyNode } from '@/utils/isNonEmptyNode';
import { HStack } from '../h-stack';
import { VStack } from '../v-stack';
import { Button } from '../button';
import {
  createContext,
  startTransition,
  useContext,
  useMemo,
  useState,
  unstable_ViewTransition as ViewTransition,
} from 'react';
import { useIsSmallScreen } from '@/utils/use-is-small-screen';

const PageLayoutHeaderContext = createContext<
  Readonly<{
    rightPanel?:
      | Readonly<{
          isExpanded: boolean;
          onToggle: (isExpanded: boolean) => void;
        }>
      | undefined;
    leftPanel?:
      | Readonly<{
          isExpanded: boolean;
          onToggle: (isExpanded: boolean) => void;
        }>
      | undefined;
  }>
>({});

const PageLayoutPanelContext = createContext<{
  side: 'left' | 'right';
  isExpanded: boolean;
  onToggle: (isExpanded: boolean) => void;
}>({
  side: 'left',
  isExpanded: true,
  onToggle: () => {},
});

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
  const isSmallScreen = useIsSmallScreen();

  const [isLeftPanelExpanded, setIsLeftPanelExpanded] =
    useState(!isSmallScreen);
  const [isRightPanelExpanded, setIsRightPanelExpanded] =
    useState(!isSmallScreen);

  const context = useMemo(
    () => ({
      leftPanel: isNonEmptyNode(leftPanel)
        ? { isExpanded: isLeftPanelExpanded, onToggle: setIsLeftPanelExpanded }
        : undefined,
      rightPanel: isNonEmptyNode(rightPanel)
        ? {
            isExpanded: isRightPanelExpanded,
            onToggle: setIsRightPanelExpanded,
          }
        : undefined,
    }),
    [isLeftPanelExpanded, isRightPanelExpanded, leftPanel, rightPanel],
  );

  const leftPanelContext = useMemo(
    () => ({
      side: 'left' as const,
      isExpanded: isLeftPanelExpanded,
      onToggle: setIsLeftPanelExpanded,
    }),
    [isLeftPanelExpanded],
  );
  const rightPanelContext = useMemo(
    () => ({
      side: 'right' as const,
      isExpanded: isRightPanelExpanded,
      onToggle: setIsRightPanelExpanded,
    }),
    [isRightPanelExpanded],
  );

  return (
    <div className="page-layout">
      <PageLayoutHeaderContext.Provider value={context}>
        {header}
      </PageLayoutHeaderContext.Provider>
      <div className="panel-layout">
        {isNonEmptyNode(leftPanel) && (
          <PageLayoutPanelContext.Provider value={leftPanelContext}>
            {leftPanel}
          </PageLayoutPanelContext.Provider>
        )}
        <main
          className={cx(
            type === 'editorial' && 'width-editorial',
            type === 'form' && 'width-form',
            // type: table is full width
          )}
        >
          {children}
        </main>
        {isNonEmptyNode(leftPanel) && (
          <PageLayoutPanelContext.Provider value={rightPanelContext}>
            {rightPanel}
          </PageLayoutPanelContext.Provider>
        )}
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
  const { leftPanel, rightPanel } = useContext(PageLayoutHeaderContext);

  return (
    <header>
      <HStack vAlign="center">
        {leftPanel != null && (
          <div className="panel-toggle panel-toggle-left">
            <Button
              onClick={() => {
                startTransition(() =>
                  leftPanel.onToggle(!leftPanel.isExpanded),
                );
              }}
            >
              {'>'}
            </Button>
          </div>
        )}
        <VStack>
          <SiteBreadcrumbs />
          <h1>{title}</h1>
          <small>{subtitle}</small>
        </VStack>
      </HStack>
      <HStack vAlign="center">
        {endContent}
        {rightPanel != null && (
          <div className="panel-toggle panel-toggle-right">
            <Button
              onClick={() => {
                startTransition(() =>
                  rightPanel.onToggle(!rightPanel.isExpanded),
                );
              }}
            >
              {'<'}
            </Button>
          </div>
        )}
      </HStack>
    </header>
  );
}

export function PageLayoutPanel({
  children,
  header,
  footer,
}: Readonly<{
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}>) {
  const { side, isExpanded } = useContext(PageLayoutPanelContext);

  return (
    <ViewTransition>
      <aside className={cx(`side-${side}`)} data-expanded={isExpanded}>
        {isNonEmptyNode(header) && header}
        <section>{children}</section>
        {isNonEmptyNode(footer) && footer}
      </aside>
    </ViewTransition>
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
