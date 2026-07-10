import { execa } from 'execa'

const toIsoString = (timestamp: number): string | null => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date.toISOString()
}

const getGitCommitDateFromGit = async (cwd: string): Promise<string | null> => {
  const { exitCode, stdout } = await execa(
    'git',
    ['log', '-1', '--format=%cI'],
    {
      cwd,
      reject: false,
    },
  )
  if (exitCode) {
    return null
  }
  if (!stdout || stdout.trim() === '') {
    return null
  }
  return toIsoString(Date.parse(stdout.trim()))
}

export const getLastUpdatedDate = async (
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
): Promise<string | null> => {
  const { GIT_COMMIT_DATE } = env
  if (GIT_COMMIT_DATE) {
    const timestampInSeconds = Number(GIT_COMMIT_DATE)
    if (Number.isFinite(timestampInSeconds)) {
      return toIsoString(timestampInSeconds * 1000)
    }
  }
  return getGitCommitDateFromGit(cwd)
}
