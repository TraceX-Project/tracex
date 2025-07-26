import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/build/**', '**/.next/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
      '@tanstack/query': pluginQuery,
    },
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      // General rules
      'no-alert': 'off',
      camelcase: 'error',
      'no-console': 'off',
      'no-nested-ternary': 'warn',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'no-restricted-exports': 'off',
      'no-promise-executor-return': 'off',
      'import/prefer-default-export': 'off',
      'prefer-destructuring': ['warn', { object: true, array: false }],

      // TypeScript rules
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',

      // React query plugin rules
      '@tanstack/query/exhaustive-deps': 'error',
      // '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',
      // '@tanstack/query/no-unstable-deps': 'warn',
      // '@tanstack/query/infinite-query-property-order': 'warn',
      // '@tanstack/query/no-void-query-fn': 'error',

      // Unused imports
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
