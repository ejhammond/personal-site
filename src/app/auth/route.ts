import { type NextRequest, NextResponse } from 'next/server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { getNextPathname } from '@/utils/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = getNextPathname({ searchParams });

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    redirectTo.pathname = next;
  } else {
    redirectTo.pathname = '/auth/login';
  }

  revalidatePath(redirectTo.pathname);
  return NextResponse.redirect(redirectTo);
}
