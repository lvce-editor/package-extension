import { join } from 'node:path'
import * as Compress from '../Compress/Compress.ts'

export const packageExtension = async ({
  highestCompression = false,
  inDir = process.cwd(),
  outFile = join(inDir, 'extension.tar.br'),
}: Readonly<{
  highestCompression?: boolean
  inDir?: string
  outFile?: string
}> = {}): Promise<void> => {
  if (highestCompression) {
    await Compress.compress(inDir, outFile)
  } else {
    await Compress.compressFasterButWithLowerCompression(inDir, outFile)
  }
}
