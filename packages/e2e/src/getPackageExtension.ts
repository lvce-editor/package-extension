import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { PackageExtensionOptions } from './PackageExtensionOptions.ts'

export const getPackageExtension = async (): Promise<
  (options?: Readonly<PackageExtensionOptions>) => Promise<void>
> => {
  const packageExtensionPath = join(
    import.meta.dirname,
    '../../package-extension/src/main.ts',
  )
  const packageExtensionModule = await import(
    pathToFileURL(packageExtensionPath).href
  )
  return packageExtensionModule.packageExtension
}
