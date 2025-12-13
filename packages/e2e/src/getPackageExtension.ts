import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export const getPackageExtension = async () => {
  const packageExtensionPath = join(
    import.meta.dirname,
    '../../package-extension/src/main.ts',
  )
  const packageExtensionModule = await import(
    pathToFileURL(packageExtensionPath).href
  )
  return packageExtensionModule.packageExtension
}
