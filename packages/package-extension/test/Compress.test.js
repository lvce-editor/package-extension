import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createBrotliDecompress } from 'node:zlib'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import tar from 'tar-fs'
import * as Compress from '../src/parts/Compress/Compress.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

/**
 * @param {string} inFile
 * @param {string} outDir
 */
export const extract = async (inFile, outDir) => {
  await mkdir(outDir, { recursive: true })
  await pipeline(
    createReadStream(inFile),
    createBrotliDecompress(),
    tar.extract(outDir)
  )
}

test('compress', async () => {
  const tmpDir = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  await writeFile(`${tmpDir}/abc.txt`, 'abc')
  await Compress.compress(tmpDir, `${tmpDir2}/result.tar.br`)
  await extract(`${tmpDir2}/result.tar.br`, tmpDir3)
  expect(await readFile(`${tmpDir3}/abc.txt`, 'utf8')).toBe('abc')
})

test('compressFasterButWithLowerCompression', async () => {
  const tmpDir = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  await writeFile(`${tmpDir}/abc.txt`, 'abc')
  await Compress.compressFasterButWithLowerCompression(
    tmpDir,
    `${tmpDir2}/result.tar.br`
  )
  await extract(`${tmpDir2}/result.tar.br`, tmpDir3)
  expect(await readFile(`${tmpDir3}/abc.txt`, 'utf8')).toBe('abc')
})
