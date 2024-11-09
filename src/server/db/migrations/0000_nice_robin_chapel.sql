CREATE TABLE IF NOT EXISTS "hytta-t3_booking" (
	"id" serial PRIMARY KEY NOT NULL,
	"cabin_id" integer NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"user_name" varchar(64),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"type" "booking_type" NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"description" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hytta-t3_cabin" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" varchar(32) NOT NULL,
	"name" varchar(64),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"image_link" varchar(128),
	"description" varchar(256),
	"address" varchar(64),
	"gmaps_link" varchar(128),
	"publicly_viewable" boolean DEFAULT false NOT NULL,
	"publicly_writeable" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hytta-t3_booking" ADD CONSTRAINT "hytta-t3_booking_cabin_id_hytta-t3_cabin_id_fk" FOREIGN KEY ("cabin_id") REFERENCES "public"."hytta-t3_cabin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
