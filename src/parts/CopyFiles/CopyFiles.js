import { cp } from 'node:fs/promises'
import { join } from 'node:path'
import { VError } from '@lvce-editor/verror'

export const copyFiles = async ({
  root,
  files,
  outDir = join(root, 'dist'),
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
