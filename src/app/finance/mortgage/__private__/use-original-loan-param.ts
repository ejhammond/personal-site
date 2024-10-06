import { Loan } from '@/utils/loan';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

export const ORIGINAL_LOAN_PARAM = 'original-loan-v1';

const originalLoanSchema = z.object({
  principal: z.number().positive().optional(),
  annualizedInterestRate: z.number().positive().max(1).optional(),
  years: z.number().positive().optional(),
});

export function serializeOriginalLoan(originalLoan: Loan): string {
  return JSON.stringify(originalLoan);
}

function getFromParams(params: URLSearchParams): Partial<Loan> | null {
  const serialized = params.get(ORIGINAL_LOAN_PARAM);
  if (serialized == null) {
    return null;
  }

  try {
    const data = JSON.parse(serialized);
    const parsed = originalLoanSchema.safeParse(data);

    if (parsed.success) {
      return parsed.data;
    }

    return null;
  } catch {
    return null;
  }
}

export default function useOriginalLoanParam() {
  const params = useSearchParams();
  const originalLoanParam = getFromParams(params);

  const [originalLoan, setOriginalLoan] = useState<Loan>({
    principal: originalLoanParam?.principal ?? 100000,
    years: originalLoanParam?.years ?? 30,
    annualizedInterestRate: originalLoanParam?.annualizedInterestRate ?? 0.055,
  });

  return {
    originalLoan,
    setOriginalLoan,
  };
}
