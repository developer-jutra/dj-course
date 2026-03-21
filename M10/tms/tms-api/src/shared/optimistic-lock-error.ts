export class OptimisticLockError extends Error {
  constructor(entityName: string, id: string, expectedVersion: number, actualVersion: number) {
    super(
      `Optimistic lock failure for ${entityName} ${id}: expected version ${expectedVersion}, found ${actualVersion}.`
    );
    this.name = 'OptimisticLockError';
  }
}
