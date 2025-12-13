import { VError } from '@lvce-editor/verror'
import { cp } from 'node:fs/promises'
import { join } from 'node:path'

export const copyFiles = async ({
  files,
  root,
  outDir = join(root, 'dist'),
}: {
  root: string
  files: string[]
  outDir?: string
}) => {
  try {
    for (const file of files) {
      const from = join(root, file)
      const to = join(outDir, file)
      await cp(from, to, { recursive: true })
    }
  } catch (error) {
    throw new VError(error, 'Failed to copy files')
  }
}
