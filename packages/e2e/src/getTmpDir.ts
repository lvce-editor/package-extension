import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const getTmpDir = (): Promise<string> => {
  return mkdtemp(join(tmpdir(), 'e2e-'))
}
