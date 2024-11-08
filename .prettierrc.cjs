module.exports = {
  plugins: [
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    require.resolve('prettier-plugin-packagejson')
  ],
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  printWidth: 80,
  trailingComma: 'none',
  importOrder: [
    '^react(.*)',
    '^next(.*)',
    '<THIRD_PARTY_MODULES>',
    '@/(.*)',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
