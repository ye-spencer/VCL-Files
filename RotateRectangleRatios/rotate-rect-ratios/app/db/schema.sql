create table trials_data_rrr (
  id bigint generated always as identity primary key,
  prolific_id text not null,
  trial_number integer not null,
  rect_a_x_percent real not null,
  rect_a_y_percent real not null,
  rect_b_x_percent real not null,
  rect_b_y_percent real not null,
  rect_a_width_percent real not null,
  rect_a_height_percent real not null,
  rect_b_width_percent real not null,
  rect_b_height_percent real not null,
  rect_a_orientation real not null,
  rect_b_orientation real not null,
  rect_a_color text not null,
  rect_b_color text not null,
  response text not null,
  response_time real not null,
  created_at timestamptz not null default now()
);

create index trials_prolific_id_idx on trials_data_rrr (prolific_id);

alter table trials_data_rrr enable row level security;