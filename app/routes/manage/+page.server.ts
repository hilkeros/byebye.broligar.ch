import { redirect, error } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { parseViewer } from '$hatk/client'
import { getCuratedAccounts, addCuratedAccount, removeCuratedAccount } from '$lib/server/curated'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ parent }) => {
  const { viewer } = await parent()
  if (!viewer || viewer.did !== env.ADMIN_DID) throw redirect(302, '/')

  return { accounts: getCuratedAccounts() }
}

export const actions: Actions = {
  add: async ({ request, cookies, fetch }) => {
    const viewer = await parseViewer(cookies)
    if (!viewer || viewer.did !== env.ADMIN_DID) throw error(403, 'Unauthorized')

    const form = await request.formData()
    const handle = (form.get('handle') as string)?.trim()
    if (!handle) return { error: 'Handle is required' }

    const resolverBase = env.PDS_URL ?? 'https://bsky.social'
    const resolveRes = await fetch(
      `${resolverBase}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`
    )
    if (!resolveRes.ok) return { error: `Could not resolve handle @${handle}` }
    const json = await resolveRes.json()
    const did: string | undefined = json.did
    if (!did) return { error: `Could not resolve handle @${handle}` }

    addCuratedAccount(did, handle)
    return { success: true }
  },

  remove: async ({ request, cookies }) => {
    const viewer = await parseViewer(cookies)
    if (!viewer || viewer.did !== env.ADMIN_DID) throw error(403, 'Unauthorized')

    const form = await request.formData()
    const did = form.get('did') as string
    if (!did) return { error: 'DID is required' }

    removeCuratedAccount(did)
    return { success: true }
  }
}
