import { readFile, writeFile } from 'node:fs/promises'

export const replace = async ({ path, occurrence, replacement }) => {
  const oldContent = await readFile(path, 'utf8')
  const newContent = oldContent.replace(occurrence, replacement)
  await writeFile(path, newContent)
}
