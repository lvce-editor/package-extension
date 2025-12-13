import { measureMemory } from '@lvce-editor/measure-memory'
<<<<<<< Updated upstream
import { instantiations, instantiationsPath, playwrightPath, threshold, workerPath } from './config.ts'
=======
import { instantiations, instantiationsPath } from './config.ts'
>>>>>>> Stashed changes

const main = async () => {
  await measureMemory({
    instantiations,
    instantiationsPath,
  })
}

main()
