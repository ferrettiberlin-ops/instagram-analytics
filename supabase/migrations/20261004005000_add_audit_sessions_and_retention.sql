alter table public.hkust_research_profiles
  add column if not exists consent_version varchar(64) not null default 'legacy-v1',
  add column if not exists consented_at timestamptz not null default now();

create table if not exists public.hkust_consent_records (
  id uuid primary key default gen_random_uuid(),
  participant_id varchar(64) not null references public.hkust_research_profiles(participant_id),
  consent_version varchar(64) not null,
  consented_at timestamptz not null default now(),
  unique (participant_id, consent_version)
);

alter table public.hkust_consent_records enable row level security;

create policy "study clients can register consent"
  on public.hkust_consent_records
  for insert
  to public
  with check (true);

alter table public.hkust_stream_logs
  add column if not exists session_id uuid not null default gen_random_uuid();

create unique index if not exists hkust_stream_logs_session_sequence_idx
  on public.hkust_stream_logs (participant_id, session_id, sequence_index);

alter table public.hkust_stream_logs
  add constraint hkust_stream_logs_canonical_url_check
  check (canonical_url ~ '^https://www\.instagram\.com/reels?/.+') not valid;

alter table public.hkust_stream_logs
  add constraint hkust_stream_logs_canonical_url_length_check
  check (char_length(canonical_url) <= 2048);

create or replace function public.purge_hkust_study_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.hkust_stream_logs;
  delete from public.hkust_consent_records;
  delete from public.hkust_research_profiles;
end;
$$;

revoke all on function public.purge_hkust_study_data() from public;
grant execute on function public.purge_hkust_study_data() to postgres, service_role;

create extension if not exists pg_cron with schema extensions;

select cron.unschedule(jobid)
from cron.job
where jobname = 'hkust-study-data-purge';

select cron.schedule(
  'hkust-study-data-purge',
  '0 3 31 12 *',
  $$select public.purge_hkust_study_data()$$
);
