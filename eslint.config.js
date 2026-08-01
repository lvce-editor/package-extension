import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedNode,
  ...config.recommendedActions,
  {
    rules: {
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      'github-actions/permissions': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'unicorn/no-unsafe-string-replacement': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'n/no-missing-import': 'off',
      'sonarjs/prefer-specific-assertions': 'off',
    },
  },
  {
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'e2e/no-imports': 'off',
    },
  },
])
