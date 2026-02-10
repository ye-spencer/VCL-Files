CREATE TABLE "whichToolYouPick" (
	"id" serial PRIMARY KEY NOT NULL,
	"duration" serial NOT NULL,
	"selected" text NOT NULL,
	"order" text NOT NULL,
	"prolificId" text NOT NULL,
	"studyId" text NOT NULL,
	"sessionId" text NOT NULL
);
