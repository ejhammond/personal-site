'use client';

import { useRef, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';

/**
 * MDX <pre> override: renders the code block with a Copy button.
 * The button copies the block's plain text via the clipboard API.
 */
export function MdxPre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (non-secure context) — leave the button as Copy
    }
  };

  return (
    <div className="mdx-pre">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <span className="mdx-pre-copy">
        <Button
          label={copied ? 'Copied' : 'Copy'}
          variant="ghost"
          size="sm"
          onClick={copy}
        />
      </span>
    </div>
  );
}
