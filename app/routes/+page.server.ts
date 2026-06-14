import { callXrpc } from '$hatk'
import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load: PageServerLoad = async () => {
  const adminDid = env.ADMIN_DID
  if (!adminDid) return { events: [] }

  const result = await callXrpc('dev.hatk.getRecords', {
    collection: 'community.lexicon.calendar.event',
    limit: 100,
    did: adminDid,
  } as any)

  return { events: result.items as any[] }
}
