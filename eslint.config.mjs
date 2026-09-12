import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';

export default defineConfig(
  ...nextVitals,
  ...nextTypescript,
  ...tseslint.configs.recommended,
  globalIgnores([
    '**/.next/**',
    'coverage/**',
    'packages/db/src/generated/**',
    'var/**',
  ]),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
