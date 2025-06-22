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
import {
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuPanelRightClose,
  LuPanelRightOpen,
} from 'react-icons/lu';

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
  type?: 'editorial' | 'form' | 'full';
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
            // type: full is full width
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
  startContent,
  endContent,
}: Readonly<{
  title: string;
  subtitle?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}>) {
  const { leftPanel, rightPanel } = useContext(PageLayoutHeaderContext);

  return (
    <header>
      <HStack vAlign="center" gap="sm">
        {startContent}
        {leftPanel != null && (
          <div className="panel-toggle panel-toggle-left">
            <Button
              variant="flat"
              onClick={() => {
                startTransition(() =>
                  leftPanel.onToggle(!leftPanel.isExpanded),
                );
              }}
            >
              {leftPanel.isExpanded ? (
                <LuPanelLeftClose />
              ) : (
                <LuPanelLeftOpen />
              )}
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
              variant="flat"
              onClick={() => {
                startTransition(() =>
                  rightPanel.onToggle(!rightPanel.isExpanded),
                );
              }}
            >
              {rightPanel.isExpanded ? (
                <LuPanelRightClose />
              ) : (
                <LuPanelRightOpen />
              )}
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
  children: (api: Readonly<{ close: () => void }>) => React.ReactNode;
  header?: (api: Readonly<{ close: () => void }>) => React.ReactNode;
  footer?: (api: Readonly<{ close: () => void }>) => React.ReactNode;
}>) {
  const { side, isExpanded, onToggle } = useContext(PageLayoutPanelContext);

  const api = useMemo(
    () => ({
      close: () => onToggle(false),
    }),
    [onToggle],
  );

  return (
    <ViewTransition>
      <aside className={cx(`side-${side}`)} data-expanded={isExpanded}>
        {header?.(api)}
        <section>{children(api)}</section>
        {footer?.(api)}
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
