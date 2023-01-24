module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'overrides': [
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    '@typescript-eslint/ban-ts-comment': 'off',
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 2,
    'no-return-await': 1,
    'no-var': 2,
    'prefer-const': 1,
    'yoda': 2,
    'no-trailing-spaces': 1,
    'eol-last': [1, 'always'],
    'no-unused-vars': [
      1,
      {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      },
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
  }
}
