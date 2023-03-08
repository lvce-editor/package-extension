import { join } from 'node:path'
import * as Compress from '../Compress/Compress.js'

export const packageExtension = async ({
  highestCompression = false,
  inDir = process.cwd(),
  outFile = join(inDir, 'extension.tar.br'),
} = {}) => {
  await (highestCompression ? Compress.compress(inDir, outFile) : Compress.compressFasterButWithLowerCompression(inDir, outFile));
}
