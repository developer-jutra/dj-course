import { SqlCargoLoadPlanRepository } from './cargo-load-plans/cargo-load-plan.repository';
import { SqlCargoLoadPlanQueries } from './cargo-load-plans/cargo-load-plan.sql-queries';
import { CargoPlansService } from './cargo-plans-service';

const repository = new SqlCargoLoadPlanRepository();
const queries = new SqlCargoLoadPlanQueries();
const service = new CargoPlansService(repository, queries);

export { repository, service, queries };
