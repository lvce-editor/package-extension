import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as CopyFiles from '../src/parts/CopyFiles/CopyFiles.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('copyFiles', async () => {
  const root = await getTmpDir()
  await writeFile(join(root, 'a.txt'), 'a')
  await CopyFiles.copyFiles({
    root,
    files: ['a.txt'],
    outDir: join(root, 'dist'),
  })
  expect(await readFile(join(root, 'dist', 'a.txt'), 'utf8')).toBe('a')
})
