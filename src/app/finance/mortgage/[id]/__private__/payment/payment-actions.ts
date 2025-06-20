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

type PaymentRow = Database['public']['Tables']['mortgage_payment']['Row'];

const paymentSchema = z.object({
  id: z.coerce.number(),
  mortgage_id: z.coerce.number(),
  user_id: z.coerce.string(),
  month: z.coerce.number().min(0),
  amount: z.coerce.number().min(0),
});

export type InsertPaymentPayload = Omit<PaymentRow, 'id' | 'user_id'>;
export type InsertPaymentActionState = ServerActionState<InsertPaymentPayload>;

export type UpdatePaymentPayload = Partial<
  Omit<PaymentRow, 'mortgage_id' | 'user_id'>
>;
type UpdatePaymentMeta = { id: number };
export type UpdatePaymentActionState = ServerActionStateWithMeta<
  InsertPaymentPayload,
  UpdatePaymentMeta
>;

export type DeletePaymentPayload = Pick<PaymentRow, 'id'>;
export type DeletePaymentActionState = ServerActionState<DeletePaymentPayload>;

export const insertPayment = createServerAction<InsertPaymentPayload>({
  schema: paymentSchema.omit({ id: true, user_id: true }),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase.from('mortgage_payment').insert(payload);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const updatePayment = createServerActionWithMeta<
  UpdatePaymentPayload,
  UpdatePaymentMeta
>({
  schema: paymentSchema.omit({ mortgage_id: true, user_id: true }).partial(),
  action: async ({ payload, meta }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mortgage_payment')
      .update(payload)
      .eq('id', meta.id);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const deletePayment = createServerAction<DeletePaymentPayload>({
  schema: paymentSchema.pick({ id: true }),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mortgage_payment')
      .delete()
      .eq('id', payload.id);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});
