import { callXrpc } from '$hatk'
import { getCuratedAccounts } from '$lib/server/curated'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const accounts = getCuratedAccounts()
  if (accounts.length === 0) return { events: [] }

  const results = await Promise.all(
    accounts.map((account) =>
      callXrpc('dev.hatk.getRecords', {
        collection: 'community.lexicon.calendar.event',
        limit: 100,
        did: account.did,
      } as any)
    )
  )

  const events = results.flatMap((r) => r.items as any[])
  return { events }
}
