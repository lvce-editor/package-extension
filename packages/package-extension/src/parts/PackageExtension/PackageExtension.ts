import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PackageExtensionOptions } from '../../PackageExtensionOptions.ts'
import * as Compress from '../Compress/Compress.ts'
import { getLastUpdatedDate } from '../GetLastUpdatedDate/GetLastUpdatedDate.ts'
import { getVersion } from '../GetVersion/GetVersion.ts'

export const packageExtension = async ({
  env = process.env,
  highestCompression = false,
  inDir = process.cwd(),
  outFile = join(inDir, 'extension.tar.br'),
<<<<<<< HEAD
  writeVersionFromGitTag = false,
}: Readonly<PackageExtensionOptions> = {}): Promise<void> => {
  if (writeVersionFromGitTag) {
    const extensionJsonPath = join(inDir, 'extension.json')
    const version = await getVersion(env)
=======
  writeLastUpdatedFromGitCommit = false,
  writeVersionFromGitTag = false,
}: Readonly<PackageExtensionOptions> = {}): Promise<void> => {
  const extensionJsonPath = join(inDir, 'extension.json')
  let extensionJson: Record<string, unknown> | null = null

  if (writeVersionFromGitTag || writeLastUpdatedFromGitCommit) {
>>>>>>> origin/main
    const extensionJsonContent = await readFile(extensionJsonPath, 'utf8')
    extensionJson = JSON.parse(extensionJsonContent)
  }

  if (writeVersionFromGitTag) {
    const version = await getVersion(env)
    extensionJson = { ...extensionJson, version }
  }

  if (writeLastUpdatedFromGitCommit) {
    const lastUpdated = await getLastUpdatedDate(env, inDir)
    if (lastUpdated !== null) {
      extensionJson = { ...extensionJson, lastUpdated }
    }
  }

  if (extensionJson !== null) {
    await writeFile(
      extensionJsonPath,
      JSON.stringify(extensionJson, null, 2) + '\n',
    )
  }

  if (highestCompression) {
    await Compress.compress(inDir, outFile)
  } else {
    await Compress.compressFasterButWithLowerCompression(inDir, outFile)
  }
}
