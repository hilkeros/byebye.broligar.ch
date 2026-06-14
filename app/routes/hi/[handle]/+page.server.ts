import { callXrpc } from '$hatk'
import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, fetch }) => {
  const handle = params.handle

  // Use PDS_URL locally (local PDS knows about local accounts),
  // fall back to bsky.social in production (global handle resolver).
  const resolverBase = env.PDS_URL ?? 'https://bsky.social'
  const resolveRes = await fetch(
    `${resolverBase}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`
  )
  if (!resolveRes.ok) {
    throw error(404, `Could not resolve handle @${handle}`)
  }
  const json = await resolveRes.json()
  const did: string | undefined = json.did
  if (!did) {
    throw error(404, `Could not resolve handle @${handle}`)
  }

  const result = await callXrpc('dev.hatk.getRecords', {
    collection: 'community.lexicon.calendar.event',
    limit: 100,
    did,
  } as any)

  return { handle, events: result.items as any[] }
}
