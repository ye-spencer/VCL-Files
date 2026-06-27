# Stimuli Difference Survey

A minimal four-screen single-page survey (Next.js App Router) that asks each
participant two agree/disagree questions about perception, and records their
responses to Supabase. Built to share conventions with the sibling experiments
in `TiltLineDegree/` and `RotateRectangleRatios/`.

## The four screens

The whole experiment is a client-side SPA driven by a single `screen` state in
[`app/page.tsx`](app/page.tsx). There is no routing — `screen` advances `0 → 3`:

| `screen` | Component | Purpose |
| -------- | --------- | ------- |
| 0 | `Intro` | Introductory text ("In this experiment, you will be asked two questions…"). Captures the Prolific ID and decides per-participant randomization. |
| 1 | `Question` | First question (which of the two it is, is randomized). |
| 2 | `Question` | Second question. |
| 3 | `EndScreen` | Thank-you text plus a button linking back to Prolific. |

## Prolific ID

On mount, `Intro` is shown while `page.tsx` reads `PROLIFIC_PID` from the URL
query string (e.g. `/?PROLIFIC_PID=abc123`). If it is absent (local testing),
the ID falls back to `"TEST OR UNKNOWN"`.

## Per-participant randomization

Decided once on mount (in the `useEffect` in `page.tsx`) and held constant for
the whole session:

- **Bar direction** (`agreeOnRight`, a coin flip): whether the bar reads
  *Strongly Disagree → Strongly Agree* (left→right) or is flipped. **The same
  direction is used for both questions** for a given participant. When flipped,
  the scale labels are reversed together with the bar.
- **Question order** (`order`, a Fisher–Yates shuffle of `[0, 1]`): which of the
  two questions is shown first.

### Scoring is direction-independent

Clicking the bar yields a raw *display* percent (0 = far left, 100 = far right).
Before logging, this is converted to a **canonical agreement score** so the data
means the same thing regardless of which way the bar was drawn:

- `score = agreeOnRight ? displayPercent : 100 - displayPercent`
- **0 = does not agree, 100 = agrees.**

The display direction is not lost — it is captured in the `left_label` /
`right_label` metadata (see schema).

## The response bar

[`app/components/question.tsx`](app/components/question.tsx) renders a preamble,
the statement (quoted), the prompt, and the clickable bar:

- Before any click there is **no marker and the Submit button is disabled
  (grayed out)**.
- Clicking anywhere on the bar drops a marker at that position and enables
  Submit.
- The participant can **click again to move the marker** as many times as they
  like before submitting.

## Database

Connection is via [`app/lib/supabase.ts`](app/lib/supabase.ts), which reads two
environment variables (names taken from `../.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

These live in `.env.local` (already populated for local dev). Writes happen in
the server action [`app/services/dataLog.service.ts`](app/services/dataLog.service.ts)
(`logResponse`), called once per question from `page.tsx`.

### Table: `survey_responses_sds`

One row per submitted question (so two rows per participant).

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `bigint identity` | Primary key / index. |
| `prolific_id` | `text` | From `PROLIFIC_PID` query param. |
| `question_id` | `text` | `"threshold_jnd"` or `"human_dog_smell"`. |
| `score` | `real` | Canonical agreement, 0 (not agree) → 100 (agree). |
| `left_label` | `text` | Label shown on the far left of this participant's bar. |
| `right_label` | `text` | Label shown on the far right. |
| `question_position` | `integer` | `1` if shown first, `2` if shown second. |
| `created_at` | `timestamptz` | Defaults to `now()`. |

`left_label` / `right_label` record the bar direction, and `question_position`
records which question came first.

## Migrations to run yourself

The schema is in [`app/db/schema.sql`](app/db/schema.sql). Run it against your
Supabase project (SQL editor or `psql`):

```sql
create table survey_responses_sds (
  id bigint generated always as identity primary key,
  prolific_id text not null,
  question_id text not null,
  score real not null,
  left_label text not null,
  right_label text not null,
  question_position integer not null,
  created_at timestamptz not null default now()
);

create index survey_responses_sds_prolific_id_idx on survey_responses_sds (prolific_id);

alter table survey_responses_sds enable row level security;
```

> Row-level security is enabled, but the app writes with the **service role
> key**, which bypasses RLS. If you instead use the anon key, add an `insert`
> policy.

## File layout

```
app/
  page.tsx                     # SPA orchestrator: screen state + randomization
  components/
    intro.tsx                  # screen 0
    question.tsx               # screens 1 & 2 (interactive bar)
    endscreen.tsx              # screen 3
  lib/
    constants.ts               # intro text, scale labels, question content, Prolific URL
    helpers.ts                 # coinFlip + shuffle
    types.ts                   # ResponseData zod schema / type
    supabase.ts                # Supabase client
  services/
    dataLog.service.ts         # logResponse server action
  db/
    schema.sql                 # table definition (run manually)
```

## Before running a real study

- Set `END_SCREEN_URL` in [`app/lib/constants.ts`](app/lib/constants.ts) to the
  real Prolific completion URL (currently a `CHANGE_ME` placeholder).
- Run the migration above against the target Supabase project.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 (add `?PROLIFIC_PID=...` to simulate a participant).
