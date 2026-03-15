import { pgTable, integer, varchar, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const vehicles = pgTable("vehicles", {
	id: integer().primaryKey().notNull(),
	make: varchar({ length: 50 }),
	model: varchar({ length: 50 }),
	year: integer(),
	fuelTankCapacity: numeric("fuel_tank_capacity", { precision: 5, scale:  1 }),
});
