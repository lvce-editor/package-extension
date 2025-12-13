import { formatApiTypes } from './formatApiTypes.ts'
import { removeInternalApiTypes } from './removeInternalApiTypes.ts'

// we want slightly different types,
// specifically instead of exporting every interface
// we only export a test api interface for tests
export const getActualApiTypesContent = (contentApi: string, contentExpect: string, contentLocator: string): string => {
  const newLines: string[] = []
  let state: 'default' | 'export' | 'after-export' | 'internal' | 'skip' = 'default'

  // Process expect content to remove @internal properties
  const processedExpectContent = removeInternalApiTypes(contentExpect)
  const expectLines = processedExpectContent.split('\n')

  for (const line of expectLines) {
    if (line.startsWith('// Generated')) {
      continue
    }
    if (line.startsWith('export {}')) {
      continue
    }
    newLines.push(line)
  }

  const locatorLines = contentLocator.split('\n')
  state = 'default'
  for (const line of locatorLines) {
    if (line.startsWith('// Generated')) {
      continue
    }
    if (line.startsWith('export {}')) {
      continue
    }
    if (line.startsWith('export interface ILocatorInternal ')) {
      state = 'skip'
      continue
    }
    if (line.startsWith('export interface ILocator ')) {
      state = 'skip'
      continue
    }
    if (line.startsWith(`declare class Locator `)) {
      state = 'skip'
      continue
    }
    if (state === 'skip' && line === '}') {
      state = 'default'
      continue
    }
    if (state === 'skip') {
      continue
    }
    if (line.startsWith('export declare const create')) {
      newLines.push(`interface LocatorConstructor {
  (selector: string, option?: any): ILocatorExternal
}`)
      continue
    }
    if (line.startsWith('export interface')) {
      newLines.push(line.replace('export interface', 'interface'))
      continue
    }

    newLines.push(line)
  }

  // Parse the API content to extract namespace information and convert to interfaces
  const contentLines = contentApi.split('\n')
  const namespaces: Record<string, string[]> = {}
  let currentNamespace: string | null = null
  let inNamespace = false
  let inExport = false
  const functionSignatures: Record<string, string> = {}

  // First pass: collect function signatures, namespace information, and exported interfaces
  let currentFunction: string | null = null
  let currentSignature: string[] = []
  const exportedInterfaces: string[] = []
  let inExportedInterface = false
  let currentInterface: string[] = []

  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i]
    if (line.startsWith('// Generated')) {
      continue
    }

    // Collect exported interfaces
    if (line.startsWith('export interface ')) {
      // Finish previous interface if any
      if (inExportedInterface && currentInterface.length > 0) {
        exportedInterfaces.push(currentInterface.join('\n'))
        currentInterface = []
      }
      inExportedInterface = true
      currentInterface.push(line)
    } else if (inExportedInterface && line.startsWith('}')) {
      currentInterface.push(line)
      exportedInterfaces.push(currentInterface.join('\n'))
      currentInterface = []
      inExportedInterface = false
    } else if (inExportedInterface) {
      currentInterface.push(line)
    }

    // Collect function signatures (handle multi-line)
    if (line.startsWith('declare const ')) {
      // Finish previous function if any
      if (currentFunction && currentSignature.length > 0) {
        functionSignatures[currentFunction] = currentSignature.join(' ').trim()
        currentFunction = null
        currentSignature = []
      }

      const match = line.match(/declare const ([\w$]+):\s*(.+)/)
      if (match) {
        const [, funcName, signature] = match
        currentFunction = funcName
        currentSignature = [signature]
      }
    } else if (currentFunction && (line.startsWith('\t') || line.startsWith('  ')) && !line.startsWith('declare ') && !inExportedInterface) {
      // Continue collecting multi-line signature (but not if it's a new declaration or in interface)
      currentSignature.push(line.trim())
    } else if (currentFunction && line.includes(';') && !inExportedInterface) {
      // End of function signature
      if (currentSignature.length > 0) {
        functionSignatures[currentFunction] = currentSignature.join(' ').trim()
        currentFunction = null
        currentSignature = []
      }
    } else if (currentFunction && line.startsWith('declare ') && !inExportedInterface) {
      // New declaration while collecting signature - finish current one
      if (currentSignature.length > 0) {
        functionSignatures[currentFunction] = currentSignature.join(' ').trim()
        currentFunction = null
        currentSignature = []
      }
    }

    // Track namespace declarations
    if (line.startsWith('declare namespace ')) {
      const match = line.match(/declare namespace (\w+)/)
      if (match) {
        currentNamespace = match[1]
        namespaces[currentNamespace] = []
        inNamespace = true
        continue
      }
    }

    if (inNamespace && (line.startsWith('\texport {') || line.startsWith('	export {'))) {
      inExport = true
      // Parse the export line immediately
      const exportLine = line.replace(/^\s*export\s*\{\s*/, '').replace(/\s*\};\s*$/, '')
      if (exportLine) {
        const exports = exportLine.split(',').map((exp) => exp.trim())
        if (currentNamespace) {
          namespaces[currentNamespace].push(...exports)
        }
      }
      continue
    }

    if (inNamespace && inExport && line.startsWith('}')) {
      inNamespace = false
      inExport = false
      currentNamespace = null
      continue
    }

    // Skip other lines when in namespace
    if (inNamespace) {
      continue
    }
  }

  // Add exported interfaces
  for (const exportedInterface of exportedInterfaces) {
    newLines.push(exportedInterface)
    newLines.push('')
  }

  // Generate interfaces for each namespace
  for (const [namespaceName, exports] of Object.entries(namespaces)) {
    newLines.push(`interface ${namespaceName} {`)
    for (const exportName of exports) {
      // Handle aliased exports (e.g., "close$1 as close")
      const [actualName, alias] = exportName.includes(' as ') ? exportName.split(' as ').map((s) => s.trim()) : [exportName, exportName]

      // Try to find the signature, first with the exact name, then with the base name
      let signature = functionSignatures[actualName]
      if (!signature) {
        // Try to find a function with the same base name
        const baseName = actualName.replace(/\$.*$/, '')
        const matchingKey = Object.keys(functionSignatures).find((key) => key === baseName)
        if (matchingKey) {
          signature = functionSignatures[matchingKey]
        }
      }

      if (signature) {
        // Special handling for FileSystem.loadFixture to remove platform parameter
        if (namespaceName === 'FileSystem' && alias === 'loadFixture') {
          // Transform the signature to remove the first parameter (platform: number)
          const modifiedSignature = signature.replace(/\(platform:\s*number,\s*/, '(')
          newLines.push(`  readonly ${alias}: ${modifiedSignature}`)
        } else {
          newLines.push(`  readonly ${alias}: ${signature}`)
        }
      }
    }
    newLines.push('}')
    newLines.push('')
  }

  // Generate TestApi interface
  newLines.push('export interface TestApi {')
  for (const namespaceName of Object.keys(namespaces)) {
    newLines.push(`  readonly ${namespaceName}: ${namespaceName}`)
  }
  newLines.push('  readonly expect: (locator: ILocatorExternal) => LocatorExpect')
  newLines.push('  readonly Locator: (selector: string, option?: any) => ILocatorExternal')
  newLines.push('}')
  newLines.push('')
  newLines.push('export interface Test {')
  newLines.push('  (api: TestApi): Promise<void>')
  newLines.push('}')
  newLines.push('')

  const formatted = formatApiTypes(newLines)

  return formatted.join('\n')
}
