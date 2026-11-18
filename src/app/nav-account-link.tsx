import { createClient } from '@/supabase/server';
import { AccountLink } from './account-link';

/**
 * The account icon in the top nav, resolved server-side. Kept in its own
 * async Server Component behind a Suspense boundary in the root layout so
 * the layout itself stays static: the auth check streams in after the
 * static shell instead of forcing every page to render dynamically.
 */
export async function NavAccountLink() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AccountLink isLoggedIn={user != null} />;
}
