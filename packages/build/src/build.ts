import { execa } from 'execa'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const dist = join(root, 'dist')
const packagePath = join(root, 'packages', 'package-extension')

const readJson = async (path: string): Promise<any> => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const writeJson = async (path: string, json: any): Promise<void> => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const getGitTagFromGit = async (): Promise<string> => {
  const { stdout, stderr, exitCode } = await execa(
    'git',
    ['describe', '--exact-match', '--tags'],
    {
      reject: false,
    },
  )
  if (exitCode) {
    if (
      exitCode === 128 &&
      stderr.startsWith('fatal: no tag exactly matches')
    ) {
      return '0.0.0-dev'
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const getVersion = async (): Promise<string> => {
  const { env } = process
  const { RG_VERSION, GIT_TAG } = env
  if (RG_VERSION) {
    if (RG_VERSION.startsWith('v')) {
      return RG_VERSION.slice(1)
    }
    return RG_VERSION
  }
  if (GIT_TAG) {
    if (GIT_TAG.startsWith('v')) {
      return GIT_TAG.slice(1)
    }
    return GIT_TAG
  }
  return getGitTagFromGit()
}

const createDist = async (): Promise<void> => {
  await mkdir(dist, { recursive: true })
}

const buildTypeScript = async (): Promise<void> => {
  await execa('npx', ['tsc'], {
    cwd: packagePath,
    stdio: 'inherit',
  })
}

const copyFiles = async (): Promise<void> => {
  await cp(join(packagePath, 'dist', 'src'), join(dist, 'src'), {
    recursive: true,
    force: true,
  })
  await cp(join(root, 'README.md'), join(dist, 'README.md'), {
    recursive: true,
    force: true,
  })
}

const copyPackageJson = async (): Promise<void> => {
  const packageJson = await readJson(join(packagePath, 'package.json'))
  const version = await getVersion()
  packageJson.version = version
  packageJson.main = 'src/main.js'
  delete packageJson.scripts
  delete packageJson.prettier
  delete packageJson.jest

  await writeJson(join(dist, 'package.json'), packageJson)
}

const main = async (): Promise<void> => {
  await createDist()
  await buildTypeScript()
  await copyFiles()
  await copyPackageJson()
}

main()
