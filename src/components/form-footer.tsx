'use client';

import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {HStack, VStack} from '@astryxdesign/core/Stack';

/**
 * Footer for the modal/edit forms: Cancel + submit buttons, with an error
 * (or success) banner underneath. Mirrors the old ds FormFooter.
 */
export function FormFooter({
  isPending = false,
  submitLabel = 'Submit',
  submitVariant = 'primary',
  errorMessage,
  successMessage,
  onCancel,
}: {
  isPending?: boolean;
  submitLabel?: string;
  submitVariant?: 'primary' | 'secondary' | 'destructive';
  errorMessage?: string;
  successMessage?: string;
  onCancel?: () => void;
}) {
  return (
    <VStack gap={3}>
      <HStack gap={2} hAlign="end">
        {onCancel != null && (
          <Button
            label="Cancel"
            variant="ghost"
            type="button"
            onClick={onCancel}
          />
        )}
        <Button
          label={submitLabel}
          variant={submitVariant}
          type="submit"
          isLoading={isPending}
        />
      </HStack>
      {errorMessage != null && (
        <Banner status="error" title={errorMessage} />
      )}
      {successMessage != null && (
        <Banner status="success" title={successMessage} />
      )}
    </VStack>
  );
}
