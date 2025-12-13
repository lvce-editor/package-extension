import { measureMemory } from '@lvce-editor/measure-memory'
<<<<<<< HEAD
<<<<<<< Updated upstream
import { instantiations, instantiationsPath, playwrightPath, threshold, workerPath } from './config.ts'
=======
import { instantiations, instantiationsPath } from './config.ts'
>>>>>>> Stashed changes
=======
import {
  instantiations,
  instantiationsPath,
  playwrightPath,
  threshold,
  workerPath,
} from './config.ts'
>>>>>>> origin/main

const main = async () => {
  await measureMemory({
    instantiations,
    instantiationsPath,
  })
}

main()
