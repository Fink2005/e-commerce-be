// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'no-lonely-if': 1,
      'no-constant-condition': 0,
      'no-trailing-spaces': 1,
      'prefer-const': 'warn',
      'no-multi-spaces': 1,
      'no-multiple-empty-lines': 1,
      'no-irregular-whitespace': 0,
      '@typescript-eslint/no-unsafe-argument': 'off',
      'pretier/prettier': 'off',
      'space-before-blocks': ['warn', 'always'],
      'object-curly-spacing': [1, 'always'],
      quotes: ['warn', 'single'],
      'array-bracket-spacing': 1,
      'linebreak-style': 0,
      'no-unexpected-multiline': 'warn',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'keyword-spacing': 1,
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'comma-spacing': 1,
      'arrow-spacing': 1,
      'no-useless-escape': 1,
    },
  },
);
