import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  yaml: false,
  ignores: [''],
  lessOpinionated: true,
  typescript: true,
  prettier: true,

  rules: {
    'prefer-arrow-callback': ['error'],
    'vue/block-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    'style/arrow-parens': ['error', 'as-needed'],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': 'off',
    'style/member-delimiter-style': 'off',
    'style/operator-linebreak': 'off',
    'style/brace-style': 'off',
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/valid-v-slot': 'off',
    'ts/no-namespace': 'off',
    'style/indent-binary-ops': 'off',
    'style/indent': 'off',
    'ts/ban-ts-comment': 'off',
  },
})
