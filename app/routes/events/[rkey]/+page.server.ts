import { callXrpc } from '$hatk'
import { redirect, error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, params }) => {
  const { viewer } = await parent()
  if (!viewer) throw redirect(302, '/')

  const uri = `at://${viewer.did}/community.lexicon.calendar.event/${params.rkey}`

  try {
    const result = await callXrpc('dev.hatk.getRecord', { uri })
    const record = result.record as any
    if (!record) throw error(404, 'Event not found')
    // getRecord returns { uri, cid, value } — the actual record data is under .value
    return { event: record.value ?? record, rkey: params.rkey }
  } catch {
    throw error(404, 'Event not found')
  }
}
