'use server';

import { createClient } from '@/supabase/server';
import { Database } from '@/types/database.types';
import {
  createServerAction,
  createServerActionWithMeta,
  ServerActionFormError,
  ServerActionState,
  ServerActionStateWithMeta,
} from '@/utils/actions';
import z from 'zod/v4';

type RecurringPaymentRow =
  Database['public']['Tables']['mortgage_recurring_payment']['Row'];

const recurringPaymentSchema = z.object({
  id: z.coerce.number(),
  mortgage_id: z.coerce.number(),
  user_id: z.coerce.string(),
  starting_month: z.coerce.number().min(0),
  amount: z.coerce.number().min(0),
});

export type InsertRecurringPaymentPayload = Omit<
  RecurringPaymentRow,
  'id' | 'user_id'
>;
export type InsertRecurringPaymentActionState =
  ServerActionState<InsertRecurringPaymentPayload>;

export type UpdateRecurringPaymentPayload = Partial<
  Omit<RecurringPaymentRow, 'mortgage_id' | 'user_id'>
>;
type UpdateRecurringPaymentMeta = { id: number };
export type UpdateRecurringPaymentActionState = ServerActionStateWithMeta<
  InsertRecurringPaymentPayload,
  UpdateRecurringPaymentMeta
>;

export type DeleteRecurringPaymentPayload = Pick<RecurringPaymentRow, 'id'>;
export type DeleteRecurringPaymentActionState =
  ServerActionState<DeleteRecurringPaymentPayload>;

export const insertRecurringPayment =
  createServerAction<InsertRecurringPaymentPayload>({
    schema: recurringPaymentSchema.omit({ id: true, user_id: true }),
    action: async ({ payload }) => {
      const supabase = await createClient();

      const { error } = await supabase
        .from('mortgage_recurring_payment')
        .insert(payload);

      if (error != null) {
        throw new ServerActionFormError(error.message);
      }
    },
  });

export const updateRecurringPayment = createServerActionWithMeta<
  UpdateRecurringPaymentPayload,
  UpdateRecurringPaymentMeta
>({
  schema: recurringPaymentSchema
    .omit({ mortgage_id: true, user_id: true })
    .partial(),
  action: async ({ payload, meta }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mortgage_recurring_payment')
      .update(payload)
      .eq('id', meta.id);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const deleteRecurringPayment =
  createServerAction<DeleteRecurringPaymentPayload>({
    schema: recurringPaymentSchema.pick({ id: true }),
    action: async ({ payload }) => {
      const supabase = await createClient();

      const { error } = await supabase
        .from('mortgage_recurring_payment')
        .delete()
        .eq('id', payload.id);

      if (error != null) {
        throw new ServerActionFormError(error.message);
      }
    },
  });
