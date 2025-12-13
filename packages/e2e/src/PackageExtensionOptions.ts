export interface PackageExtensionOptions {
  env?: NodeJS.ProcessEnv
  highestCompression?: boolean
  inDir?: string
  outFile?: string
  writeVersionFromGitTag?: boolean
  writeLastUpdatedFromGitCommit?: boolean
}
