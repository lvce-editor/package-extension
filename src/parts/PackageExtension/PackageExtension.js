import * as Compress from '../Compress/Compress.js'
import { join } from 'node:path'

export const packageExtension = async ({
  highestCompression = false,
  inDir = process.cwd(),
  outFile = join(inDir, 'extension.tar.br'),
} = {}) => {
  if (highestCompression) {
    await Compress.compress(inDir, outFile)
  } else {
    await Compress.compressFasterButWithLowerCompression(inDir, outFile)
  }
}
