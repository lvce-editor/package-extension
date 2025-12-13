import { readFile, writeFile } from 'node:fs/promises'

export const replace = async ({
  occurrence,
  path,
  replacement,
}: Readonly<{
  path: string
  occurrence: string | RegExp
  replacement: string
}>): Promise<void> => {
  const oldContent = await readFile(path, 'utf8')
  const newContent = oldContent.replace(occurrence, replacement)
  await writeFile(path, newContent)
}
