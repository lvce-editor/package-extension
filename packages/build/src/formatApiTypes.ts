/**
 * Formats API types content to ensure consistent spacing and structure.
 * This function normalizes spacing to have exactly one newline between interfaces
 * and removes inconsistent formatting throughout the content.
 */
export const formatApiTypes = (lines: string[]): string[] => {
  return normalizeInterfaceSpacing(lines)
}

/**
 * Normalizes spacing to ensure exactly one newline between interfaces.
 * Removes multiple consecutive empty lines and ensures consistent spacing.
 */
const normalizeInterfaceSpacing = (lines: string[]): string[] => {
  const result: string[] = []
  let lastWasEmpty = false
  let inInterface = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isEmpty = line.trim() === ''
    const isInterfaceStart = line.includes('interface ') || line.includes('export interface ')
    const isInterfaceEnd = line.trim() === '}'

    // Track when we're inside an interface
    if (isInterfaceStart) {
      inInterface = true
    } else if (isInterfaceEnd && inInterface) {
      inInterface = false
    }

    // Skip empty lines at the beginning
    if (result.length === 0 && isEmpty) {
      continue
    }

    // Handle empty lines
    if (isEmpty) {
      if (!lastWasEmpty) {
        result.push('')
        lastWasEmpty = true
      }
      // Skip additional empty lines
    } else {
      // Add exactly one newline before interface declarations (except the first one)
      if (isInterfaceStart && result.length > 0 && !lastWasEmpty) {
        result.push('')
      }

      result.push(line)
      lastWasEmpty = false
    }
  }

  // Remove trailing empty lines
  while (result.length > 0 && result[result.length - 1].trim() === '') {
    result.pop()
  }

  return result
}
