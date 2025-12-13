export interface PackageExtensionOptions {
  env?: NodeJS.ProcessEnv
  highestCompression?: boolean
  inDir?: string
  outFile?: string
  writeLastUpdatedFromGitCommit?: boolean
  writeVersionFromGitTag?: boolean
}
