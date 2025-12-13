import { readFile, writeFile } from 'node:fs/promises'

export const replace = async ({
  occurrence,
  path,
  replacement,
}: {
  path: string
  occurrence: string | RegExp
  replacement: string
}) => {
  const oldContent = await readFile(path, 'utf8')
  const newContent = oldContent.replace(occurrence, replacement)
  await writeFile(path, newContent)
}
