import { parseViewer } from "$hatk/client";
import { env } from '$env/dynamic/private'
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const viewer = await parseViewer(cookies);
  const lang = cookies.get('lang') === 'de' ? 'de' : 'en'
  const isAdmin = !!(viewer && env.ADMIN_DID && viewer.did === env.ADMIN_DID)
  return { viewer, lang, isAdmin };
};
