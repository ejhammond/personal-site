import { Loan } from '@/utils/loan';
import { useState } from 'react';

export default function useOriginalLoan(init: Loan) {
  const [originalLoan, setOriginalLoan] = useState<Loan>(init);

  return {
    originalLoan,
    setOriginalLoan,
  };
}
