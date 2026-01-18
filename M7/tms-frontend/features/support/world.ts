import { IWorldOptions, World } from "@cucumber/cucumber";
import { Page } from "@playwright/test";

export interface CustomWorld extends World {
  page?: Page;
}

export class CustomWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
  }
}
