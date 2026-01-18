import { When } from "@cucumber/cucumber";

// Only define the unique step for v2 - "find first document with number"
// Other steps are already defined in documents-management.steps.ts and will be reused

When('I find first document with number {string}', async function (documentNumber: string) {
  // Wait for the documents to load and find the first tile containing the specified number
  this.documentTile = this.page.locator('.bg-white.rounded-lg.shadow-lg.border', {
    hasText: documentNumber
  }).first();
  await this.documentTile.waitFor();
});
