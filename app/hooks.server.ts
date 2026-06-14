import { setLang } from '$lib/lang.svelte'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.cookies.get('lang') === 'de' ? 'de' : 'en'
  setLang(lang)
  return resolve(event)
}
