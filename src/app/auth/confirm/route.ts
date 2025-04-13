import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/supabase/server';
import { getNextPathname } from '@/utils/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = getNextPathname({ searchParams });

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash == null || type == null) {
    redirectTo.pathname = `/auth/login?error=${encodeURIComponent('Invalid confirmation link')}`;
  } else {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (error != null) {
      redirectTo.pathname = `/auth/login?error=${encodeURIComponent(error.message)}`;
    } else {
      // on success, we can clear the "next" param
      redirectTo.searchParams.delete('next');
    }
  }

  return NextResponse.redirect(redirectTo);
}
