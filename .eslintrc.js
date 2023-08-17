module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:import/typescript'],
  root: true,
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': [
      1,
      {
        printWidth: 120,
      },
    ],
    'import/no-cycle': 2,
    'import/order': [
      1,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': [
      1,
      {
        types: {
          Function: false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/naming-convention': [
      1,
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: { regex: '(^I[A-Z]|Config|Manager)', match: true },
      },
    ],
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-console': [1, { allow: ['info', 'warn', 'error'] }],
  },
};
