CREATE TYPE "public"."case_type" AS ENUM('emergency', 'ambulatory', 'ward', 'home_care');--> statement-breakpoint
CREATE TYPE "public"."disposition" AS ENUM('admitted', 'discharged', 'transferred', 'home', 'deceased');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."skill_type" AS ENUM('surgical', 'communication');--> statement-breakpoint
CREATE TABLE "cases" (
	"id" text PRIMARY KEY NOT NULL,
	"caseType" "case_type" NOT NULL,
	"institutionId" text,
	"encounterDate" timestamp with time zone NOT NULL,
	"patientName" text NOT NULL,
	"patientAge" double precision NOT NULL,
	"patientSex" "sex" NOT NULL,
	"disposition" "disposition",
	"history" text,
	"diagnosis" text,
	"procedures" text,
	"management" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "procedures" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"minAgeYears" integer,
	"maxAgeYears" integer,
	"sex" "sex",
	"isPreset" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "skill_type" NOT NULL,
	"description" text,
	"isPreset" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_institutionId_institutions_id_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;