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

type RefinanceRow = Database['public']['Tables']['mortgage_refinance']['Row'];

const refinanceSchema = z.object({
  id: z.coerce.number(),
  mortgage_id: z.coerce.number(),
  user_id: z.coerce.string(),
  month: z.coerce.number().min(0),
  principal: z.coerce.number().min(0).nullable(),
  annualized_interest_rate: z.coerce.number().min(0),
  term: z.coerce.number().int().min(1),
  pre_payment: z.coerce.number().min(0).nullable(),
});

export type InsertRefinancePayload = Omit<RefinanceRow, 'id' | 'user_id'>;
export type InsertRefinanceActionState =
  ServerActionState<InsertRefinancePayload>;

export type UpdateRefinancePayload = Partial<
  Omit<RefinanceRow, 'mortgage_id' | 'user_id'>
>;
type UpdateRefinanceMeta = { id: number };
export type UpdateRefinanceActionState = ServerActionStateWithMeta<
  InsertRefinancePayload,
  UpdateRefinanceMeta
>;

export type DeleteRefinancePayload = Pick<RefinanceRow, 'id'>;
export type DeleteRefinanceActionState =
  ServerActionState<DeleteRefinancePayload>;

export const insertRefinance = createServerAction<InsertRefinancePayload>({
  schema: refinanceSchema.omit({ id: true, user_id: true }),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase.from('mortgage_refinance').insert(payload);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const updateRefinance = createServerActionWithMeta<
  UpdateRefinancePayload,
  UpdateRefinanceMeta
>({
  schema: refinanceSchema.omit({ mortgage_id: true, user_id: true }).partial(),
  action: async ({ payload, meta }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mortgage_refinance')
      .update(payload)
      .eq('id', meta.id);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const deleteRefinance = createServerAction<DeleteRefinancePayload>({
  schema: refinanceSchema.pick({ id: true }),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mortgage_refinance')
      .delete()
      .eq('id', payload.id);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});
