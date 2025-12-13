import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PackageExtensionOptions } from '../../../../e2e/src/PackageExtensionOptions.ts'
import * as Compress from '../Compress/Compress.ts'
import { getVersion } from '../GetVersion/GetVersion.ts'

export const packageExtension = async ({
  highestCompression = false,
  inDir = process.cwd(),
  outFile = join(inDir, 'extension.tar.br'),
  writeVersionFromGitTag = false,
  env = process.env,
}: Readonly<PackageExtensionOptions> = {}): Promise<void> => {
  if (writeVersionFromGitTag) {
    const extensionJsonPath = join(inDir, 'extension.json')
    const version = await getVersion(env)
    const extensionJsonContent = await readFile(extensionJsonPath, 'utf8')
    const extensionJson = JSON.parse(extensionJsonContent)
    const newExtensionJson = { ...extensionJson, version }
    await writeFile(
      extensionJsonPath,
      JSON.stringify(newExtensionJson, null, 2) + '\n',
    )
  }
  if (highestCompression) {
    await Compress.compress(inDir, outFile)
  } else {
    await Compress.compressFasterButWithLowerCompression(inDir, outFile)
  }
}
