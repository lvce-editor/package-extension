import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { pipeline } from 'node:stream/promises'
import tar from 'tar-fs'
import { constants, createBrotliCompress } from 'node:zlib'

/**
 * @param {string} inDir
 * @param {string} outFile
 */
export const compress = async (inDir, outFile) => {
  await mkdir(dirname(outFile), { recursive: true })
  await pipeline(
    tar.pack(inDir),
    createBrotliCompress(),
    createWriteStream(outFile)
  )
}

/**
 * @param {string} inDir
 * @param {string} outFile
 */
export const compressFasterButWithLowerCompression = async (inDir, outFile) => {
  await mkdir(dirname(outFile), { recursive: true })
  await pipeline(
    tar.pack(inDir, {
      filter(x) {
        return x === 'extension.tar.br'
      },
    }),
    createBrotliCompress({
      params: {
        [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MIN_QUALITY,
      },
    }),
    createWriteStream(outFile)
  )
}
