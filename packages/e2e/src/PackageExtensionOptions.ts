export interface PackageExtensionOptions {
  readonly highestCompression?: boolean
  readonly inDir?: string
  readonly outFile?: string
  readonly writeVersionFromGitTag?: boolean
  readonly env?: NodeJS.ProcessEnv
}
