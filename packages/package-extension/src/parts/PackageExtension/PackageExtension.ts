import { join } from 'node:path'
import * as Compress from '../Compress/Compress.js'

export const packageExtension = async ({
  highestCompression = false,
  inDir = process.cwd(),
  outFile = join(inDir, 'extension.tar.br'),
}: {
  highestCompression?: boolean
  inDir?: string
  outFile?: string
} = {}) => {
  if (highestCompression) {
    await Compress.compress(inDir, outFile)
  } else {
    await Compress.compressFasterButWithLowerCompression(inDir, outFile)
  }
}
