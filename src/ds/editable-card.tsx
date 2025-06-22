import { useMemo, useState } from 'react';
import { Card } from './card';
import { HStack } from './h-stack';
import { Button } from './button';
import { KebabMenuIcon, PencilIcon, TrashIcon } from './icons';
import { Menu, MenuItem } from './menu';

export function EditableCard({
  onEdit,
  onRemove,
  children,
  ...delegated
}: React.ComponentProps<typeof Card> & {
  onEdit: () => void;
  onRemove?: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const actionButton = useMemo(() => {
    if (onEdit != null && onRemove == null) {
      return (
        <Button variant="flat" onPress={onEdit} aria-label="Edit ">
          <PencilIcon />
        </Button>
      );
    }

    if (onRemove != null && onEdit == null) {
      return (
        <Button variant="flat" onPress={onRemove} aria-label="Remove">
          <TrashIcon />
        </Button>
      );
    }

    return (
      <Menu
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        button={
          <Button
            variant="flat"
            onPress={() => setIsMenuOpen(true)}
            aria-label="Option"
          >
            <KebabMenuIcon />
          </Button>
        }
      >
        <MenuItem onAction={onEdit}>
          <PencilIcon />
        </MenuItem>
        <MenuItem onAction={onRemove}>
          <TrashIcon />
        </MenuItem>
      </Menu>
    );
  }, [isMenuOpen, onEdit, onRemove]);

  return (
    <Card {...delegated}>
      <HStack vAlign="start">
        <div style={{ flexGrow: 1 }}>{children}</div>
        <div style={{ marginBlockStart: -12, marginInlineEnd: -4 }}>
          {actionButton}
        </div>
      </HStack>
    </Card>
  );
}
