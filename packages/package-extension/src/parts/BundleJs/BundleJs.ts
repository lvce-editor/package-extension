export const bundleJs = async (
  input: string,
  outFile: string,
  sourceMap: boolean = true,
): Promise<void> => {
  const { babel } = await import('@rollup/plugin-babel')
  const { default: pluginTypeScript } = await import('@babel/preset-typescript')
  const { rollup } = await import('rollup')
  const { nodeResolve } = await import('@rollup/plugin-node-resolve')
  const commonJsModule = await import('@rollup/plugin-commonjs')
  const jsonModule = await import('@rollup/plugin-json')
  const commonJs = commonJsModule.default as unknown as (
    ...args: readonly any[]
  ) => any
  const json = jsonModule.default as unknown as (...args: readonly any[]) => any

  const workerOutput = await rollup({
    input,
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [pluginTypeScript],
      }),
      nodeResolve(),
      commonJs(),
      json(),
    ],
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
    },
  })

  await workerOutput.write({
    file: outFile,
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
    hoistTransitiveImports: false,
    inlineDynamicImports: true,
    minifyInternalExports: false,
    sourcemap: sourceMap,
    sourcemapExcludeSources: true,
  })
}
