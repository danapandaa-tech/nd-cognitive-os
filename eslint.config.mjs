import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'output/**',
      'scripts/**',
      '*.config.js',
    ],
  },

  // Base recommended rules
  js.configs.recommended,

  // Project source rules
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Catch common errors
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'off', // Not reliable with JSX; rely on build for import checks
    },
  },
];
