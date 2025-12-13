import { execa } from 'execa'

const getGitCommitDateFromGit = async (
  cwd: string,
): Promise<number | null> => {
  const { exitCode, stdout } = await execa(
    'git',
    ['log', '-1', '--format=%cd', '--date=format:%Y%m%d%H%M%S'],
    {
      reject: false,
      cwd,
    },
  )
  if (exitCode) {
    return null
  }
  if (!stdout || stdout.trim() === '') {
    return null
  }
  const dateString = stdout.trim()
  // Parse YYYYMMDDHHMMSS format
  const year = parseInt(dateString.slice(0, 4), 10)
  const month = parseInt(dateString.slice(4, 6), 10) - 1 // Month is 0-indexed
  const day = parseInt(dateString.slice(6, 8), 10)
  const hour = parseInt(dateString.slice(8, 10), 10)
  const minute = parseInt(dateString.slice(10, 12), 10)
  const second = parseInt(dateString.slice(12, 14), 10)
  const date = new Date(year, month, day, hour, minute, second)
  return Math.floor(date.getTime() / 1000) // Convert to unix timestamp (seconds)
}

export const getLastUpdatedDate = async (
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
): Promise<number | null> => {
  const { GIT_COMMIT_DATE } = env
  if (GIT_COMMIT_DATE) {
    const timestamp = parseInt(GIT_COMMIT_DATE, 10)
    if (!isNaN(timestamp)) {
      return timestamp
    }
  }
  return getGitCommitDateFromGit(cwd)
}
