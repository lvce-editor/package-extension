import { test, expect } from '@jest/globals'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { extract, getPackageExtension, getTmpDir } from '../src/helpers.ts'

test('packageExtension with default options creates tar.br in inDir', async () => {
  const packageExtension = await getPackageExtension()
  const extensionDir = await getTmpDir()
  const extractDir = await getTmpDir()
  const defaultOutFile = join(extensionDir, 'extension.tar.br')

  await writeFile(
    join(extensionDir, 'extension.json'),
    JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2) + '\n',
  )

  await packageExtension({
    inDir: extensionDir,
    writeVersionFromGitTag: false,
  })

  const stats = await stat(defaultOutFile)
  expect(stats.isFile()).toBe(true)

  await extract(defaultOutFile, extractDir)

  const extractedExtensionJson = JSON.parse(
    await readFile(join(extractDir, 'extension.json'), 'utf8'),
  )
  expect(extractedExtensionJson.name).toBe('test')
})
