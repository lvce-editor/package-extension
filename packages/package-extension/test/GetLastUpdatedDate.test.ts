import { expect, test } from '@jest/globals'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getLastUpdatedDate } from '../src/parts/GetLastUpdatedDate/GetLastUpdatedDate.ts'

test('getLastUpdatedDate converts an environment timestamp to a UTC ISO string', async () => {
  const env = {
    GIT_COMMIT_DATE: '1705294800',
  }
  expect(await getLastUpdatedDate(env)).toBe('2024-01-15T05:00:00.000Z')
})

test('getLastUpdatedDate returns null outside a git repository', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'package-extension-'))
  try {
    expect(await getLastUpdatedDate({}, cwd)).toBe(null)
  } finally {
    await rm(cwd, { force: true, recursive: true })
  }
})
