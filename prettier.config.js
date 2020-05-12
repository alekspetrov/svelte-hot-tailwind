module.exports = {
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 80,
  proseWrap: 'always',
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  semi: false,
  arrowParens: 'avoid',
  overrides: [
    {
      files: [
        '.prettierrc',
        '.eslintrc',
        '.babelrc',
        '.tern-project',
        '.stylelintrc',
        '.lighthouserc'
      ],
      options: {
        parser: 'json'
      }
    },
    {
      files: ['package.json'],
      options: {
        printWidth: 180
      }
    }
  ]
}
