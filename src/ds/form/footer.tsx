import React from 'react';
import { HStack } from '../h-stack';
import { Button } from '../button';
import { VStack } from '../v-stack';
import StatusMessage from '../status-message';
import { FormEventContext } from './event-context';
import FormSubmitButton from './submit-button';

type FormFooterProps = {
  onCancel?: () => void;
  submitButton?: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
};

export default function FormFooter({
  submitButton,
  errorMessage,
  successMessage,
  onCancel,
}: FormFooterProps) {
  const eventContext = React.useContext(FormEventContext);

  return (
    <VStack>
      <HStack
        gap="sm"
        style={{
          alignSelf: 'stretch',
          justifyContent: 'flex-end',
        }}
      >
        {(onCancel != null || eventContext?.onCancel != null) && (
          <Button
            type="button"
            variant="flat"
            onPress={() => {
              onCancel?.();
              eventContext?.onCancel();
            }}
          >
            Cancel
          </Button>
        )}
        {submitButton ?? <FormSubmitButton />}
      </HStack>
      {errorMessage != null && (
        <StatusMessage variant="error" message={errorMessage} />
      )}
      {successMessage != null && (
        <StatusMessage variant="info" message={successMessage} />
      )}
    </VStack>
  );
}
