import { FaFile, FaFolder } from 'react-icons/fa';
import { HStack } from './h-stack';
import { Link } from './link';

export default function DirectoryListing({
  label,
  type = 'file',
  href,
  isSelected = false,
}: {
  label: string;
  type?: 'file' | 'folder';
  href?: string | null;
  isSelected?: boolean;
}) {
  const labelContent = (
    <HStack vAlign="center" gap="md">
      {type === 'file' ? (
        <FaFile style={{ flexShrink: 0 }} />
      ) : (
        <FaFolder style={{ flexShrink: 0 }} />
      )}{' '}
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </span>
    </HStack>
  );
  return (
    <div
      style={{
        boxSizing: 'border-box',
        paddingInline: '8px',
        fontWeight: isSelected ? 'bold' : 'inherit',
        outline: isSelected ? '1px solid var(--color-border)' : 'none',
      }}
    >
      {href != null ? (
        <Link href={href}>{labelContent}</Link>
      ) : (
        <>{labelContent}</>
      )}
    </div>
  );
}
