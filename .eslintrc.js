module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'react-compiler/react-compiler': 'error'
  },
  plugins: ['eslint-plugin-react-compiler']
}
