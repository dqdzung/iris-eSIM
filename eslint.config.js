const { defineConfig } = require('eslint/config');
const globals = require('globals');
const expoConfig = require('eslint-config-expo/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
  expoConfig,
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  {
    ignores: ['dist/*'],
  },

  // Node-context files (eslint config, build scripts, etc.) need Node globals.
  {
    files: ['eslint.config.js', 'scripts/**/*.js'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'react/display-name': 'off',

      // Force `import type { Foo }` (inline-merged when mixed with values)
      // so type-only bindings get erased at compile time.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Merge multiple imports from the same module into one line,
      // using inline `type` modifier when needed.
      'import/no-duplicates': ['error', { 'prefer-inline': true }],

      // Sort import/export statements (groups: side-effect, packages,
      // scoped packages, parent, sibling, styles — alphabetised inside each).
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // `.d.ts` files routinely use `import('foo').Bar` to type-annotate module
  // declarations — that's the normal pattern, not something to lint away.
  // Must come AFTER the general TS block so the override wins.
  {
    files: ['**/*.d.ts'],
    rules: { '@typescript-eslint/consistent-type-imports': 'off' },
  },
]);
