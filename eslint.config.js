import * as config from '@lvce-editor/eslint-config'
import actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...config.recommendedNode,
  ...actions,
  // ...config
  {
    rules: {
      'github-actions/permissions': 'off',
    },
  },
]
