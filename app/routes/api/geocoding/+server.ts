import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get('q')?.trim()
  if (!q) return json([])

  const nomUrl =
    'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=' +
    encodeURIComponent(q)

  try {
    const res = await fetch(nomUrl, {
      headers: {
        'User-Agent': 'byebye.broligar.ch/1.0',
        Referer: 'https://byebye.broligar.ch',
      },
    })
    if (!res.ok) return json([])
    const results = await res.json()
    return json(results)
  } catch {
    return json([])
  }
}
