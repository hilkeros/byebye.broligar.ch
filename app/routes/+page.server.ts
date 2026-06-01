import { callXrpc } from '$hatk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent }) => {
  const { viewer } = await parent()
  if (!viewer) return { events: [] }

  const result = await callXrpc('dev.hatk.getRecords', {
    collection: 'community.lexicon.calendar.event',
    limit: 100,
  })

  const events = (result.items as any[]).filter((item: any) =>
    item.uri?.startsWith(`at://${viewer.did}/`)
  )

  return { events }
}
