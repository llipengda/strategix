import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'page-bg': 'var(--page-bg)',
        'card-bg': 'var(--card-bg)',
        title: 'var(--title)',
        label: 'var(--label)',
        'input-bg': 'var(--input-bg)',
        'input-txt': 'var(--input-txt)',
        'input-bd': 'var(--input-bd)',
        'input-ring': 'var(--input-ring)',
        main: 'var(--main)',
        disabled: 'var(--disabled)'
      }
    }
  },
  plugins: []
}
export default config
