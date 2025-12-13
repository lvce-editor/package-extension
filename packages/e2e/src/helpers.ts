import { createReadStream } from 'node:fs'
import { mkdir, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { createBrotliDecompress } from 'node:zlib'
import { pathToFileURL } from 'node:url'
import tar from 'tar-fs'

export const getTmpDir = (): Promise<string> => {
  return mkdtemp(join(tmpdir(), 'e2e-'))
}

export const extract = async (inFile: string, outDir: string): Promise<void> => {
  await mkdir(outDir, { recursive: true })
  await pipeline(
    createReadStream(inFile),
    createBrotliDecompress(),
    tar.extract(outDir),
  )
}

export const getPackageExtension = async () => {
  const packageExtensionPath = join(
    import.meta.dirname,
    '../../package-extension/src/main.ts',
  )
  const packageExtensionModule = await import(
    pathToFileURL(packageExtensionPath).href
  )
  return packageExtensionModule.packageExtension
}
