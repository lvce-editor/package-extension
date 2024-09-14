export const bundleJs = async (input, outFile, sourceMap = true) => {
  const { babel } = await import('@rollup/plugin-babel')
  const { default: pluginTypeScript } = await import('@babel/preset-typescript')
  const { rollup } = await import('rollup')

  const prettierWorkerOutput = await rollup({
    input,
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [pluginTypeScript],
      }),
    ],
  })

  await prettierWorkerOutput.write({
    file: outFile,
    format: 'es',
    sourcemap: sourceMap,
    sourcemapExcludeSources: true,
    inlineDynamicImports: true,
    freeze: false,
    minifyInternalExports: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
    hoistTransitiveImports: false,
  })
}
