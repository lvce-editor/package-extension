import { cp, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const addPlaygroundFiles = async ({
  commitHash,
  filesPath,
  root,
}: Readonly<{
  root: string
  commitHash: string
  filesPath: string
}>): Promise<void> => {
  await rm(join(root, 'dist', commitHash, 'playground'), {
    force: true,
    recursive: true,
  })
  await cp(filesPath, join(root, 'dist', commitHash, 'playground'), {
    recursive: true,
  })

  const dirents = await readdir(join(root, 'dist', commitHash, 'playground'))
  const fileMap = dirents.map((dirent) => `/playground/${dirent}`)
  await writeFile(
    join(root, 'dist', commitHash, 'config', 'fileMap.json'),
    JSON.stringify(fileMap, null, 2) + '\n',
  )
}
