import { createClient } from '@/supabase/server';
import { getNextPathname } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const next = getNextPathname({
    searchParams,
    defaultPathname: '/auth/login',
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath(next, 'layout');
  return NextResponse.redirect(new URL(next, req.url), {
    status: 302,
  });
}
