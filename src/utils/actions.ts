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
  revalidate,
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
  /**
   * Routes showing this action's data, revalidated after a successful
   * mutation so the page the user is looking at refreshes instead of
   * going stale until a manual refresh. Dynamic segments may be given as
   * patterns (e.g. '/finance/mortgages/[id]') — those revalidate every
   * matching page. Actions that redirect don't need this: the redirect
   * target is a fresh navigation that fetches current data.
   */
  revalidate?: ReadonlyArray<string>;
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

      for (const path of revalidate ?? []) {
        revalidatePath(path, 'page');
      }

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
  revalidate,
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
  /**
   * Routes showing this action's data; see createServerAction.
   */
  revalidate?: ReadonlyArray<string>;
}>) {
  return async (
    payload: TPayload,
    meta: TMeta,
  ): Promise<ServerActionStateWithMeta<TPayload, TMeta>> => {
    const base = createServerAction({
      schema,
      revalidate,
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
