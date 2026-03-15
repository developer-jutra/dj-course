/** @type {import('orval').Config} */
module.exports = {
  tmsApi: {
    input: './contract/openapi.yaml',
    output: {
      target: './contract/contract-types-orval/tms.ts',
      schemas: './contract/contract-types-orval/model',
      mode: 'tags-split',
      client: 'axios',
      prettier: false,
    },
  },
};
