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
  created_at timestamptz not null default now()
);

create index trials_prolific_id_idx on trials_data_tld (prolific_id);

alter table trials_data_tld enable row level security;