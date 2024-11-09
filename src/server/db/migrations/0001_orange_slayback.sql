ALTER TABLE "hytta-t3_booking" RENAME COLUMN "type" TO "booking_type";--> statement-breakpoint
ALTER TABLE "hytta-t3_cabin" RENAME COLUMN "publicly_viewable" TO "is_publicly_viewable";--> statement-breakpoint
ALTER TABLE "hytta-t3_cabin" RENAME COLUMN "publicly_writeable" TO "is_publicly_writeable";