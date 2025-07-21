import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Configuration for all JS/TS files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // Important for TypeScript rules
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },

    rules: {
      // Disable base rule and use TypeScript version
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'no-constant-condition': 'off',
      'no-console': 'error',

      // Additional TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
      'no-lonely-if': 'error',
      'no-unsafe-member-access': 'error',
      'no-unsafe-return': 'error',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-unsafe-optional-chaining': 'error',
      'prefer-const': 'warn',
    },
  },

  // Browser environment for specific files if needed
  {
    files: ['**/*.client.{js,ts}', '**/frontend/**/*.{js,ts}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
);
