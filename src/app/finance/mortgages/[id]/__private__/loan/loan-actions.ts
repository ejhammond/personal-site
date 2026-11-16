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
import { redirect } from 'next/navigation';
import { nullableNumber, requiredNumber } from '@/utils/schema';
import z from 'zod/v4';

type LoanRow = Database['public']['Tables']['mortgage']['Row'];

const loanSchema = z.object({
  id: z.coerce.number(),
  user_id: z.coerce.string(),
  name: z.string().min(1).max(200),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
  month: requiredNumber(z.number().int().min(1).max(12)),
  year: requiredNumber(z.number().int().min(1900).max(2100)),
  principal: requiredNumber(z.number().min(1)),
  annualized_interest_rate: requiredNumber(z.number().min(0).max(1)),
  term: requiredNumber(z.number().int().min(1)),
  pre_payment: nullableNumber(z.number().min(0)),
});

// A pre-payment at or above the amount financed leaves a zero (or
// negative) starting balance, so amortize() returns an empty schedule and
// the stats page crashes. Applied at each use site below: Zod checks do
// not survive .omit()/.partial(), so it can't live on the base schema.
const prePaymentLessThanPrincipal = (data: {
  principal?: number;
  pre_payment?: number | null;
}) =>
  data.pre_payment == null ||
  data.principal == null ||
  data.pre_payment < data.principal;

const prePaymentCheck = {
  message: 'Pre-payment must be less than the amount financed',
  path: ['pre_payment'],
};

export type InsertLoanPayload = Omit<
  LoanRow,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;
export type InsertLoanActionState = ServerActionState<InsertLoanPayload>;

export type CloneLoanPayload = InsertLoanPayload;
export type CloneLoanActionState = ServerActionState<InsertLoanPayload>;

export type UpdateLoanPayload = Partial<
  Omit<LoanRow, 'mortgage_id' | 'user_id' | 'created_at' | 'updated_at'>
>;
type UpdateLoanMeta = { id: number };
export type UpdateLoanActionState = ServerActionStateWithMeta<
  InsertLoanPayload,
  UpdateLoanMeta
>;

export type RenameLoanPayload = Pick<LoanRow, 'name'>;
type RenameLoanMeta = { id: number };
export type RenameLoanActionState = ServerActionStateWithMeta<
  RenameLoanPayload,
  RenameLoanMeta
>;

export type DeleteLoanPayload = Pick<LoanRow, 'id'>;
export type DeleteLoanActionState = ServerActionState<DeleteLoanPayload>;

export const insertLoan = createServerAction<InsertLoanPayload>({
  schema: loanSchema
    .omit({
      id: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    })
    .refine(prePaymentLessThanPrincipal, prePaymentCheck),
  revalidate: ['/finance/mortgages'],
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase.from('mortgage').insert(payload);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});

export const cloneLoan = createServerAction<CloneLoanPayload>({
  schema: loanSchema
    .omit({
      id: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    })
    .refine(prePaymentLessThanPrincipal, prePaymentCheck),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error, data } = await supabase
      .from('mortgage')
      .insert(payload)
      .select('id');

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }

    const id = data?.[0]?.id;
    if (id == null) {
      throw new ServerActionFormError(
        'Failed to clone mortgage: no id returned',
      );
    }

    redirect(`/finance/mortgages/${id}`);
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
    .partial()
    .refine(prePaymentLessThanPrincipal, prePaymentCheck),
  revalidate: ['/finance/mortgages/[id]', '/finance/mortgages'],
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

export const renameLoan = createServerActionWithMeta<
  RenameLoanPayload,
  RenameLoanMeta
>({
  schema: loanSchema.pick({
    name: true,
  }),
  revalidate: ['/finance/mortgages/[id]', '/finance/mortgages'],
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

    redirect('/finance/mortgages');
  },
});
