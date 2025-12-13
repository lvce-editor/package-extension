import { test, expect } from '@jest/globals'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { extract, getPackageExtension, getTmpDir } from '../src/helpers.ts'

test('packageExtension creates tar.br file with correct contents', async () => {
  const packageExtension = await getPackageExtension()
  const extensionDir = await getTmpDir()
  const outputDir = await getTmpDir()
  const extractDir = await getTmpDir()
  const outFile = join(outputDir, 'extension.tar.br')

  const extensionJson = {
    name: 'test-extension',
    version: '1.0.0',
    description: 'Test extension',
  }

  await writeFile(
    join(extensionDir, 'extension.json'),
    JSON.stringify(extensionJson, null, 2) + '\n',
  )
  await writeFile(join(extensionDir, 'README.md'), '# Test Extension\n')
  await mkdir(join(extensionDir, 'src'), { recursive: true })
  await writeFile(join(extensionDir, 'src', 'index.js'), 'console.log("test")\n')

  await packageExtension({
    inDir: extensionDir,
    outFile,
    writeVersionFromGitTag: false,
    highestCompression: false,
  })

  const stats = await stat(outFile)
  expect(stats.isFile()).toBe(true)
  expect(stats.size).toBeGreaterThan(0)

  await extract(outFile, extractDir)

  const extractedExtensionJson = JSON.parse(
    await readFile(join(extractDir, 'extension.json'), 'utf8'),
  )
  expect(extractedExtensionJson.name).toBe('test-extension')
  expect(extractedExtensionJson.version).toBe('1.0.0')

  const extractedReadme = await readFile(join(extractDir, 'README.md'), 'utf8')
  expect(extractedReadme).toBe('# Test Extension\n')

  const extractedIndex = await readFile(join(extractDir, 'src', 'index.js'), 'utf8')
  expect(extractedIndex).toBe('console.log("test")\n')
})
