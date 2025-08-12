import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginQuery from '@tanstack/eslint-plugin-query';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    ignores: ['.next'],
    plugins: {
      'unused-imports': unusedImports,
      '@tanstack/query': pluginQuery,
    },
  },
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      // ...pluginQuery.configs.recommended.rules,
    ],
    rules: {
      // Tanstack query
      ...pluginQuery.configs.recommended.rules,

      // general
      'no-alert': 'off',
      camelcase: 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-nested-ternary': 'warn',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'no-restricted-exports': 'off',
      'no-promise-executor-return': 'off',
      'import/prefer-default-export': 'off',
      'prefer-destructuring': ['warn', { object: true, array: false }],

      // TypeScript
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],

      // Unused imports
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

      // React
      'react/no-children-prop': [
        'error',
        {
          allowFunctions: true,
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/no-array-index-key': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
      'react/jsx-no-duplicate-props': ['warn', { ignoreCase: false }],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  }
);
