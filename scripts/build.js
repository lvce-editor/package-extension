import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const packagePath = root

const getVersion = () => {
  const stdout = execSync('git describe --exact-match --tags').toString().trim()
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const createDist = () => {
  mkdirSync(join(root, 'dist'), { recursive: true })
}

const copyPackageJson = () => {
  const packageJson = JSON.parse(
    readFileSync(join(packagePath, 'package.json'), 'utf8')
  )
  packageJson.version = getVersion()
  delete packageJson.scripts
  delete packageJson.prettier
  delete packageJson.jest

  writeFileSync(
    join(root, 'dist', 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  )
}

const copyFiles = () => {
  cpSync(join(packagePath, 'src'), join(root, 'dist', 'src'), {
    recursive: true,
    force: true,
  })
  cpSync(join(root, 'README.md'), join(root, 'dist', 'README.md'), {
    recursive: true,
    force: true,
  })
}

const main = () => {
  createDist()
  copyPackageJson()
  copyFiles()
}

main()
