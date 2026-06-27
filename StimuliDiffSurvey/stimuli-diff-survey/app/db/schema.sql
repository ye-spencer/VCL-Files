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
