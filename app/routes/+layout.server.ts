import { parseViewer } from "$hatk/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const viewer = await parseViewer(cookies);
  const lang = cookies.get('lang') === 'de' ? 'de' : 'en'
  return { viewer, lang };
};
