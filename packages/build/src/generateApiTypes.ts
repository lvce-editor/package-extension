import { execa } from 'execa'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'
import { getActualApiTypesContent } from './getActualApiTypesContent.ts'

export const generateApiTypes = async (): Promise<void> => {
  const ext = process.platform === 'win32' ? '' : ''
  const bundleGeneratorPath = join(root, 'packages', 'build', 'node_modules', '.bin', 'dts-bundle-generator' + ext)

  await Promise.all([
    execa(bundleGeneratorPath, ['-o', '../../.tmp/api-types/api.d.ts', 'src/parts/TestFrameWorkComponent/TestFrameWorkComponent.ts'], {
      cwd: join(root, 'packages', 'test-worker'),
      reject: false,
    }),
    execa(bundleGeneratorPath, ['-o', '../../.tmp/api-types/expect.d.ts', 'src/parts/LocatorExpect/LocatorExpect.ts'], {
      cwd: join(root, 'packages', 'test-worker'),
      reject: false,
    }),
    execa(bundleGeneratorPath, ['-o', '../../.tmp/api-types/locator.d.ts', 'src/parts/Locator/Locator.ts'], {
      cwd: join(root, 'packages', 'test-worker'),
      reject: false,
    }),
  ])
  const content = await readFile(join(root, '.tmp', 'api-types', 'api.d.ts'), 'utf8')
  const contentExpect = await readFile(join(root, '.tmp', 'api-types', 'expect.d.ts'), 'utf8')
  const contentLocator = await readFile(join(root, '.tmp', 'api-types', 'locator.d.ts'), 'utf8')
  const actual = getActualApiTypesContent(content, contentExpect, contentLocator)
  await writeFile(join(root, '.tmp', 'dist', 'dist', 'api.d.ts'), actual)
}
