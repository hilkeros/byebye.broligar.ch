import { callXrpc } from '$hatk'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, url }) => {
  const { viewer } = await parent()
  if (!viewer) throw redirect(302, '/')

  const result = await callXrpc('dev.hatk.getRecords', {
    collection: 'community.lexicon.calendar.event',
    limit: 100,
    did: viewer.did,
  } as any)

  return { events: result.items as any[], siteUrl: `${url.protocol}//${url.host}` }
}
