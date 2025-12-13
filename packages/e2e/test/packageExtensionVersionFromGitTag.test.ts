import { test, expect } from '@jest/globals'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getPackageExtension } from '../src/getPackageExtension.ts'
import { getTmpDir } from '../src/getTmpDir.ts'

test('packageExtension adds version from git tag to extension.json', async () => {
  const packageExtension = await getPackageExtension()
  const extensionDir = await getTmpDir()
  const extensionJsonPath = join(extensionDir, 'extension.json')

  const originalExtensionJson = {
    description: 'Test extension',
    name: 'test-extension',
  }

  await writeFile(
    extensionJsonPath,
    JSON.stringify(originalExtensionJson, null, 2) + '\n',
  )

  const originalEnv = process.env.GIT_TAG
  try {
    process.env.GIT_TAG = 'v2.3.4'
    await packageExtension({
      highestCompression: false,
      inDir: extensionDir,
      writeVersionFromGitTag: true,
    })

    const updatedExtensionJson = JSON.parse(
      await readFile(extensionJsonPath, 'utf8'),
    )
    expect(updatedExtensionJson.name).toBe('test-extension')
    expect(updatedExtensionJson.description).toBe('Test extension')
    expect(updatedExtensionJson.version).toBe('2.3.4')
  } finally {
    if (originalEnv === undefined) {
      delete process.env.GIT_TAG
    } else {
      process.env.GIT_TAG = originalEnv
    }
  }
})

test('packageExtension adds version from git tag without v prefix to extension.json', async () => {
  const packageExtension = await getPackageExtension()
  const extensionDir = await getTmpDir()
  const extensionJsonPath = join(extensionDir, 'extension.json')

  const originalExtensionJson = {
    name: 'test-extension',
    version: '1.0.0',
  }

  await writeFile(
    extensionJsonPath,
    JSON.stringify(originalExtensionJson, null, 2) + '\n',
  )

  const originalEnv = process.env.GIT_TAG
  try {
    process.env.GIT_TAG = '3.5.6'
    await packageExtension({
      highestCompression: false,
      inDir: extensionDir,
      writeVersionFromGitTag: true,
    })

    const updatedExtensionJson = JSON.parse(
      await readFile(extensionJsonPath, 'utf8'),
    )
    expect(updatedExtensionJson.name).toBe('test-extension')
    expect(updatedExtensionJson.version).toBe('3.5.6')
  } finally {
    if (originalEnv === undefined) {
      delete process.env.GIT_TAG
    } else {
      process.env.GIT_TAG = originalEnv
    }
  }
})
