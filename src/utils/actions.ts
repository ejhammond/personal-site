import z from 'zod/v4';
import { arrayToMap } from './map';
import { revalidatePath } from 'next/cache';

type ServerActionFormErrors<TPayload extends { [key: string]: unknown }> = {
  [K in keyof TPayload]?: string;
} & { form?: string | undefined };

export type ServerActionState<TPayload extends { [key: string]: unknown }> = {
  errors?: ServerActionFormErrors<TPayload>;
};

export type ServerActionStateWithMeta<
  TPayload extends { [key: string]: unknown },
  TMeta = object,
> = ServerActionState<TPayload> & {
  meta?: TMeta;
};

export class ServerActionFormError extends Error {}

export function createServerAction<
  TPayload extends { [key: string]: unknown },
>({
  action,
  schema,
}: Readonly<{
  /**
   * Action to perform. Only runs if the payload is valid according to the
   * schema. Throw a ServerActionFormError if you want to abort and show an
   * error in the form.
   */
  action: (
    input: Readonly<{
      payload: Readonly<TPayload>;
    }>,
  ) => Promise<undefined>;
  schema: z.ZodType<TPayload>;
}>) {
  return async (payload: TPayload): Promise<ServerActionState<TPayload>> => {
    const validation = schema.safeParse(payload);

    if (!validation.success) {
      const issuesByField = arrayToMap(validation.error.issues, (issue) =>
        issue.path[0].toString(),
      );

      const errors = Object.fromEntries(
        Object.keys(payload).map((key) => [
          key,
          issuesByField.get(key)?.message,
        ]),
      ) as ServerActionFormErrors<TPayload>;

      return {
        errors,
      };
    }

    try {
      await action({
        payload: validation.data,
      });

      revalidatePath('/');

      return {};
    } catch (error) {
      if (error instanceof ServerActionFormError) {
        return {
          errors: { form: error.message },
        };
      }

      throw error;
    }
  };
}

export function createServerActionWithMeta<
  TPayload extends { [key: string]: unknown },
  TMeta = object,
>({
  action,
  schema,
}: Readonly<{
  /**
   * Action to perform. Only runs if the payload is valid according to the
   * schema. Throw a ServerActionFormError if you want to abort and show an
   * error in the form.
   */
  action: (
    input: Readonly<{
      payload: Readonly<TPayload>;
      meta: Readonly<TMeta>;
    }>,
  ) => Promise<undefined>;
  schema: z.ZodType<TPayload>;
}>) {
  return async (
    payload: TPayload,
    meta: TMeta,
  ): Promise<ServerActionStateWithMeta<TPayload, TMeta>> => {
    const base = createServerAction({
      schema,
      action: async ({ payload }) => {
        return action({ payload, meta });
      },
    });

    const baseState = await base(payload);

    return {
      ...baseState,
      meta,
    };
  };
}
