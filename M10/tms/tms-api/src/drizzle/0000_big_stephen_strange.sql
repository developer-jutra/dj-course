-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "vehicles" (
	"id" integer PRIMARY KEY NOT NULL,
	"make" varchar(50),
	"model" varchar(50),
	"year" integer,
	"fuel_tank_capacity" numeric(5, 1)
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"email" varchar(100),
	"phone" varchar(20),
	"contract_type" varchar(20),
	"status" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"email" varchar(100),
	"phone" varchar(20),
	"customer_type" varchar(20),
	"address" varchar(255),
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transportation_orders" (
	"id" integer PRIMARY KEY NOT NULL,
	"order_number" varchar(20) NOT NULL,
	"customer_id" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"order_date" timestamp NOT NULL,
	"expected_delivery" date,
	"shipping_address" varchar(255),
	"shipping_city" varchar(100),
	"shipping_state" varchar(50),
	"shipping_zip_code" varchar(20),
	"shipping_method" varchar(50),
	"tracking_number" varchar(50),
	CONSTRAINT "transportation_orders_order_number_key" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "order_timeline_events" (
	"id" integer PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_timestamp" timestamp NOT NULL,
	"title" varchar(100),
	"description" text,
	"executed_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" integer PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_name" varchar(100) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"item_type" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transportation_orders" ADD CONSTRAINT "transportation_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_timeline_events" ADD CONSTRAINT "order_timeline_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."transportation_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."transportation_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_customers_first_name_lower_pattern" ON "customers" USING btree (lower((first_name)::text) text_pattern_ops);--> statement-breakpoint
CREATE INDEX "idx_customers_last_name_lower_pattern" ON "customers" USING btree (lower((last_name)::text) text_pattern_ops);--> statement-breakpoint
CREATE INDEX "idx_orders_customer" ON "transportation_orders" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "transportation_orders" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_timeline_order" ON "order_timeline_events" USING btree ("order_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_items_order" ON "order_items" USING btree ("order_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_notifications_created_at" ON "notifications" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_notifications_user" ON "notifications" USING btree ("user_id" int4_ops);
*/