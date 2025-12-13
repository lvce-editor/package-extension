import { join } from 'node:path'
import { root } from './root.ts'

export const instantiations = 11_000

export const instantiationsPath = join(root, 'packages', 'package-extension')
