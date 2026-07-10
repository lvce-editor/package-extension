import { test, expect } from '@jest/globals'
import { execa } from 'execa'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getPackageExtension } from '../src/getPackageExtension.ts'
import { getTmpDir } from '../src/getTmpDir.ts'

test('packageExtension adds lastUpdated from git commit to extension.json', async () => {
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

  await execa('git', ['init'], { cwd: extensionDir })
  await execa('git', ['config', 'user.email', 'test@example.com'], {
    cwd: extensionDir,
  })
  await execa('git', ['config', 'user.name', 'Test User'], {
    cwd: extensionDir,
  })
  await execa('git', ['add', 'extension.json'], { cwd: extensionDir })
  const commitDate = '2024-01-15T10:30:00+05:30'
  await execa('git', ['commit', '-m', 'Initial commit'], {
    cwd: extensionDir,
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: commitDate,
      GIT_COMMITTER_DATE: commitDate,
    },
  })

  await packageExtension({
    highestCompression: false,
    inDir: extensionDir,
    writeLastUpdatedFromGitCommit: true,
  })

  const updatedExtensionJson = JSON.parse(
    await readFile(extensionJsonPath, 'utf8'),
  )
  expect(updatedExtensionJson.name).toBe('test-extension')
  expect(updatedExtensionJson.description).toBe('Test extension')
  expect(typeof updatedExtensionJson.lastUpdated).toBe('string')
  expect(updatedExtensionJson.lastUpdated).toBe('2024-01-15T05:00:00.000Z')
})
