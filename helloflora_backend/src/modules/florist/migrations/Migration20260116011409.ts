import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260116011409 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "florist" ("id" text not null, "name" text not null, "company_name" text null, "address" text not null, "city" text not null, "county" text not null, "country" text not null, "zip_code" text not null, "location" jsonb null, "main_phone" text not null, "second_phone" text null, "email" text null, "website" text null, "note" text null, "close_time" text null, "is_open" boolean not null default false, "image_url" text null, "iban" text null, "rate" integer null, "florist_status" text check ("florist_status" in ('pending', 'approved', 'rejected')) not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "florist_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_florist_deleted_at" ON "florist" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "florist" cascade;`);
  }

}
