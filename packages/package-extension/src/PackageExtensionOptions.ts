export interface PackageExtensionOptions {
  readonly env?: NodeJS.ProcessEnv
  readonly highestCompression?: boolean
  readonly inDir?: string
  readonly outFile?: string
  readonly writeLastUpdatedFromGitCommit?: boolean
  readonly writeVersionFromGitTag?: boolean
}
