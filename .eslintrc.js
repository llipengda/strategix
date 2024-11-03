module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-compiler/react-compiler': 'error'
  },
  plugins: ['eslint-plugin-react-compiler']
}
