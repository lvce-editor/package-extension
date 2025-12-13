import { execa } from 'execa'
import { mkdir, readFile, writeFile, readdir, stat, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const copyE2eTestFiles = async (srcDir: string, destDir: string): Promise<void> => {
  const files = await readdir(srcDir)

  for (const file of files) {
    const srcPath = join(srcDir, file)
    const destPath = join(destDir, file)

    const stats = await stat(srcPath)
    if (stats.isDirectory()) {
      await mkdir(destPath, { recursive: true })
      await copyE2eTestFiles(srcPath, destPath)
    } else if (file.endsWith('.ts')) {
      const content = await readFile(srcPath, 'utf8')

      // Replace test-with-playwright imports with our generated API types
      const modifiedContent = content.replace(
        /import type { Test } from '@lvce-editor\/test-with-playwright'/g,
        "import type { Test } from '../api.d.ts'",
      )

      await writeFile(destPath, modifiedContent)
    }
  }
}

export const verifyE2eTypes = async (): Promise<void> => {
  const tempDir = join(root, '.tmp', 'e2e-type-verification')
  const generatedTypesPath = join(root, '.tmp', 'dist', 'dist', 'api.d.ts')
  const e2eSrcDir = join(root, 'packages', 'e2e', 'src')

  // Always clean up any existing temp directory to ensure clean state
  await rm(tempDir, { recursive: true, force: true })

  // Create temporary directory structure
  await mkdir(tempDir, { recursive: true })
  const tempSrcDir = join(tempDir, 'src')
  await mkdir(tempSrcDir, { recursive: true })

  // Copy the generated types to temp directory root
  const generatedTypes = await readFile(generatedTypesPath, 'utf8')
  await writeFile(join(tempDir, 'api.d.ts'), generatedTypes)

  // Copy all e2e test files and replace imports
  await copyE2eTestFiles(e2eSrcDir, tempSrcDir)

  // Copy the tsconfig.json from the e2e package
  const e2eTsconfigPath = join(root, 'packages', 'e2e', 'tsconfig.json')
  const e2eTsconfig = await readFile(e2eTsconfigPath, 'utf8')
  await writeFile(join(tempDir, 'tsconfig.json'), e2eTsconfig)

  // Run TypeScript compiler to check for errors
  const { stdout, stderr, exitCode } = await execa('npx', ['tsc', '--noEmit'], {
    cwd: tempDir,
    reject: false,
  })

  if (exitCode !== 0) {
    console.error('TypeScript compilation failed:')
    console.error('STDOUT:', stdout)
    console.error('STDERR:', stderr)
    console.error('Working directory:', tempDir)
    console.error('Generated types path:', generatedTypesPath)
    throw new Error(`E2E type verification failed with exit code ${exitCode}`)
  }

  console.log('✅ E2E type verification passed - all e2e tests compile correctly with generated API types')
}
