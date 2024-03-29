# @lvce-editor/package-extension

Utility package for packaging an extension into a tar.br file.

## Usage

```js
import { copyFiles, packageExtension } from '@lvce-editor/package-extension'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

await copyFiles({
  root,
  files: ['README.md', 'extension.json', 'languageConfiguration.json', 'src'],
})

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
```

## Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/lvce-editor/package-extension)
