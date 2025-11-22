import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import ts from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores(['.pnp.*', '.yarn', 'coverage', 'dist']),
  eslint.configs.recommended,
  ts.configs.recommendedTypeChecked.map((cfg) => ({ ...cfg, files: ['**/*.{ts,tsx}'] })),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': ['error', {
        allow: ['warn', 'error'],
      }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-object-type': ['error', {
        allowInterfaces: 'with-single-extends'
      }],
    }
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.test-d.{ts,tsx}'],
    plugins: {
      vitest
    },
    settings: {
      vitest: {
        typecheck: true
      }
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/prefer-called-exactly-once-with': 'off',
    }
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.test-d.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': ['off'],
      '@typescript-eslint/no-unused-vars': ['off'],
      '@typescript-eslint/prefer-promise-reject-errors': ['off'],
      '@typescript-eslint/require-await': ['off'],
      '@typescript-eslint/unbound-method': ['off'],
    }
  },
  {
    files: ['**/*.test-d.{ts,tsx}'],
    rules: {
      'vitest/expect-expect': ['error', {
        assertFunctionNames: ['expectTypeOf', 'assertType']
      }],
    }
  }
);
