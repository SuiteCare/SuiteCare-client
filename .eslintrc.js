module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
    'prettier',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
  ],
  globals: {
    NodeJS: true,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.js', '.jsx'],
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'arrow-body-style': 'off',
    'no-plusplus': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'no-restricted-exports': ['error', { restrictDefaultExports: { defaultFrom: false } }],
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@/lib/**',
            group: 'external',
          },
          {
            pattern: '{types/*,@/types*,./types}',
            group: 'type',
          },
          {
            pattern:
              '{hooks,@/hooks/**/*,./hooks/**,./use**,../use**,../../use**,../../../use**,,../../hooks/**,./_hooks/**,../../../_hooks/**}',
            group: 'internal',
          },
          {
            pattern: '{utils/**/*,./utils,../utils,../../utils,../../../utils}',
            group: 'type',
          },
          {
            pattern: '{@/constants/*,./constants}',
            group: 'type',
          },
          {
            pattern:
              '{states/**/*,./states*,./**/states*,../states*,../../states*,../../../states*,,../../../../states*,**/**/**/states*}',
            group: 'type',
          },
          {
            pattern: '@/services/**',
            group: 'type',
          },
          {
            pattern: '{./helpers,./data,./config,./defaults,../../../defaults}',
            group: 'type',
          },
          {
            pattern:
              '{components,components/_common/**,@/components,@/components/**,svgs,@/assets/**/*,@/app/**,routes/**,public/**}',
            group: 'index',
          },
          {
            pattern: '{styles,./*.css,../*.css,../*.module.css}',
            group: 'index',
          },
        ],
        groups: [
          ['external', 'builtin'],
          ['type', 'internal', 'object'],
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],
    'import/no-anonymous-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.stories.*', '**/.storybook/**/*.*'],
        peerDependencies: true,
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'no-param-reassign': ['error', { props: false }],
    'no-unused-expressions': ['warn'],
    'no-unused-vars': ['warn'],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'lines-between-class-members': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: ['label'],
        labelAttributes: ['htmlFor'],
        controlComponents: ['input'],
      },
    ],
  },
};
