import * as config from '@lvce-editor/eslint-config'
import actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...config.recommendedNode,
  ...actions,
  {
    rules: {
      'github-actions/permissions': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
]
