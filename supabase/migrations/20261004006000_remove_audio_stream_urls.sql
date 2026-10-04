delete from public.hkust_stream_logs
where canonical_url ~ '^https://www\.instagram\.com/reels?/audio(?:/|$)';

alter table public.hkust_stream_logs
  drop constraint if exists hkust_stream_logs_canonical_url_check;

alter table public.hkust_stream_logs
  add constraint hkust_stream_logs_canonical_url_check
  check (
    canonical_url ~ '^https://www\.instagram\.com/reels?/[^/]+/?$'
    and canonical_url !~ '^https://www\.instagram\.com/reels?/audio(/|$)'
  ) not valid;
