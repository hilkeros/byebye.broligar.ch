import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface CuratedAccount {
  did: string
  handle: string
  addedAt: string
}

const dataDir = process.env.NODE_ENV === 'production' ? '/data' : 'data'
const filePath = join(dataDir, 'curated-accounts.json')

export function getCuratedAccounts(): CuratedAccount[] {
  if (!existsSync(filePath)) return []
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return []
  }
}

function save(accounts: CuratedAccount[]) {
  writeFileSync(filePath, JSON.stringify(accounts, null, 2), 'utf-8')
}

export function addCuratedAccount(did: string, handle: string) {
  const accounts = getCuratedAccounts()
  const existing = accounts.findIndex((a) => a.did === did)
  if (existing >= 0) {
    accounts[existing].handle = handle
  } else {
    accounts.push({ did, handle, addedAt: new Date().toISOString() })
  }
  save(accounts)
}

export function removeCuratedAccount(did: string) {
  const accounts = getCuratedAccounts().filter((a) => a.did !== did)
  save(accounts)
}
