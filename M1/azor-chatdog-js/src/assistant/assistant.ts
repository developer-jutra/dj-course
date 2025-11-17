/**
 * Assistant class representing AI assistant configuration
 */

export class Assistant {
  private _systemPrompt: string;
  private _name: string;

  constructor(systemPrompt: string, name: string) {
    this._systemPrompt = systemPrompt;
    this._name = name;
  }

  get systemPrompt(): string {
    return this._systemPrompt;
  }

  get name(): string {
    return this._name;
  }
}
