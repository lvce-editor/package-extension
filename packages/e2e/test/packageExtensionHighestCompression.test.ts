import { test, expect } from '@jest/globals'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { extract } from '../src/extract.ts'
import { getPackageExtension } from '../src/getPackageExtension.ts'
import { getTmpDir } from '../src/getTmpDir.ts'

test('packageExtension with highestCompression creates valid tar.br file', async () => {
  const packageExtension = await getPackageExtension()
  const extensionDir = await getTmpDir()
  const outputDir = await getTmpDir()
  const extractDir = await getTmpDir()
  const outFile = join(outputDir, 'extension.tar.br')

  const extensionJson = {
    name: 'test-extension-2',
    version: '2.0.0',
  }

  await writeFile(
    join(extensionDir, 'extension.json'),
    JSON.stringify(extensionJson, null, 2) + '\n',
  )
  await writeFile(join(extensionDir, 'file.txt'), 'test content\n')

  await packageExtension({
    inDir: extensionDir,
    outFile,
    writeVersionFromGitTag: false,
    highestCompression: true,
  })

  const stats = await stat(outFile)
  expect(stats.isFile()).toBe(true)
  expect(stats.size).toBeGreaterThan(0)

  await extract(outFile, extractDir)

  const extractedExtensionJson = JSON.parse(
    await readFile(join(extractDir, 'extension.json'), 'utf8'),
  )
  expect(extractedExtensionJson.name).toBe('test-extension-2')

  const extractedFile = await readFile(join(extractDir, 'file.txt'), 'utf8')
  expect(extractedFile).toBe('test content\n')
})
