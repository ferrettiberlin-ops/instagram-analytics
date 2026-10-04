create or replace view public.hkust_stream_logs_hkt
with (security_invoker = true)
as
select
  id,
  participant_id,
  session_id,
  scrolled_at,
  scrolled_at at time zone 'Asia/Hong_Kong' as scrolled_at_hkt,
  canonical_url,
  sequence_index,
  is_sponsored
from public.hkust_stream_logs;

select cron.unschedule(jobid)
from cron.job
where jobname = 'hkust-study-data-purge';

select cron.schedule(
  'hkust-study-data-purge',
  '0 19 30 12 *',
  $$select public.purge_hkust_study_data()$$
);
