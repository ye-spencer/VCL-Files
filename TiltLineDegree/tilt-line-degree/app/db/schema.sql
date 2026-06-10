create table trials_data_tld (
  id bigint generated always as identity primary key,
  prolific_id text not null,
  trial_number integer not null,
  degrees_tilted real not null,
  tilt_direction text not null,
  rectangle_height_percent real not null,
  rectangle_width_percent real not null,
  rectangle_color text not null,
  response text not null,
  response_time real not null,
  experiment_version smallint not null default 1,
  created_at timestamptz not null default now()
);

create index trials_prolific_id_idx on trials_data_tld (prolific_id);

alter table trials_data_tld enable row level security;

-- Migration for existing databases: backfill all existing rows to version 1.
-- (Safe to skip on a fresh setup created from the statements above.)
-- alter table trials_data_tld
--   add column experiment_version smallint not null default 1;