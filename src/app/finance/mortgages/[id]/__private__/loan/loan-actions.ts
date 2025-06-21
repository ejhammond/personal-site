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

type LoanRow = Database['public']['Tables']['mortgage']['Row'];

const loanSchema = z.object({
  id: z.coerce.number(),
  user_id: z.coerce.string(),
  name: z.string(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(0),
  principal: z.coerce.number().min(0),
  annualized_interest_rate: z.coerce.number().min(0),
  term: z.coerce.number().int().min(1),
  pre_payment: z.coerce.number().min(0).nullable(),
});

export type InsertLoanPayload = Omit<
  LoanRow,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;
export type InsertLoanActionState = ServerActionState<InsertLoanPayload>;

export type UpdateLoanPayload = Partial<
  Omit<LoanRow, 'mortgage_id' | 'user_id' | 'created_at' | 'updated_at'>
>;
type UpdateLoanMeta = { id: number };
export type UpdateLoanActionState = ServerActionStateWithMeta<
  InsertLoanPayload,
  UpdateLoanMeta
>;

export type DeleteLoanPayload = Pick<LoanRow, 'id'>;
export type DeleteLoanActionState = ServerActionState<DeleteLoanPayload>;

export const insertLoan = createServerAction<InsertLoanPayload>({
  schema: loanSchema.omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
  }),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase.from('mortgage').insert(payload);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const updateLoan = createServerActionWithMeta<
  UpdateLoanPayload,
  UpdateLoanMeta
>({
  schema: loanSchema
    .omit({
      id: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    })
    .partial(),
  action: async ({ payload, meta }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mortgage')
      .update(payload)
      .eq('id', meta.id);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const deleteLoan = createServerAction<DeleteLoanPayload>({
  schema: loanSchema.pick({ id: true }),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mortgage')
      .delete()
      .eq('id', payload.id);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});
