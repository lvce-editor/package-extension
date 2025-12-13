import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const packagePath = join(root, 'packages', 'package-extension')

const getVersion = () => {
  try {
    const stdout = execSync('git describe --exact-match --tags')
      .toString()
      .trim()
    if (stdout.startsWith('v')) {
      return stdout.slice(1)
    }
    return stdout
  } catch {
    return '0.0.0-dev'
  }
}

const createDist = () => {
  mkdirSync(join(root, 'dist'), { recursive: true })
}

const copyPackageJson = () => {
  const packageJson = JSON.parse(
    readFileSync(join(packagePath, 'package.json'), 'utf8'),
  )
  packageJson.version = getVersion()
  packageJson.main = 'src/main.js'
  delete packageJson.scripts
  delete packageJson.prettier
  delete packageJson.jest

  writeFileSync(
    join(root, 'dist', 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n',
  )
}

const buildTypeScript = () => {
  execSync('npx tsc -b tsconfig.build.json', {
    cwd: packagePath,
    stdio: 'inherit',
  })
}

const cleanupTsBuildInfo = async () => {
  const distPath = join(packagePath, 'dist')
  try {
    const files = await readdir(distPath)
    for (const file of files) {
      if (file.endsWith('.tsbuildinfo')) {
        rmSync(join(distPath, file), { force: true })
      }
    }
  } catch {
    // dist directory might not exist, ignore
  }
}

const copyFiles = async () => {
  await cleanupTsBuildInfo()
  cpSync(join(packagePath, 'dist', 'src'), join(root, 'dist', 'src'), {
    recursive: true,
    force: true,
  })
  cpSync(join(root, 'README.md'), join(root, 'dist', 'README.md'), {
    recursive: true,
    force: true,
  })
}

const main = async () => {
  createDist()
  buildTypeScript()
  await copyFiles()
  copyPackageJson()
}

main()
