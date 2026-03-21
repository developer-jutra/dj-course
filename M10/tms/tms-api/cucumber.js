module.exports = {
  default: {
    formatOptions: {
      snippetInterface: 'async-await',
    },
    paths: ['src/cargo-plans/**/*.feature'],
    dryRun: false,
    require: ['src/cargo-plans/**/*.steps.ts'],
    requireModule: ['ts-node/register'],
    parallel: 1
  }
}
