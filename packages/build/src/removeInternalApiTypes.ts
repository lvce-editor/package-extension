/**
 * Removes properties marked with @internal from TypeScript interface definitions.
 * This function processes interface content and filters out any properties that
 * have @internal in their JSDoc comments.
 */
export const removeInternalApiTypes = (content: string): string => {
  const lines = content.split('\n')
  const newLines: string[] = []
  let inInterface = false
  let skipProperty = false
  let inComment = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip generated file headers
    if (line.startsWith('// Generated')) {
      continue
    }
    if (line.startsWith('export {}')) {
      continue
    }

    // Check if we're entering an interface
    if (line.includes('interface ') || line.includes('export interface ')) {
      inInterface = true
      newLines.push(line)
      continue
    }

    // Check if we're exiting an interface
    if (inInterface && line.startsWith('}')) {
      inInterface = false
      newLines.push(line)
      continue
    }

    // If we're inside an interface, check for @internal properties
    if (inInterface) {
      const currentLine = line.trim()

      // Check if we're starting a comment block
      if (currentLine.startsWith('/**')) {
        inComment = true
        continue
      }

      // Check if we're ending a comment block
      if (inComment && currentLine.startsWith('*/')) {
        inComment = false
        continue
      }

      // If we're in a comment, check for @internal
      if (inComment) {
        if (currentLine.includes('@internal')) {
          skipProperty = true
        }
        continue
      }

      // If we're skipping a property, check if this is the property declaration
      if (skipProperty) {
        // This should be the property declaration line
        skipProperty = false
        continue
      }

      // Add the line if we're not skipping
      newLines.push(line)
    } else {
      // Outside the interface, add all lines
      newLines.push(line)
    }
  }

  return newLines.join('\n')
}
