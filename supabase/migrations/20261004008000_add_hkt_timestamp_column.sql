alter table public.hkust_stream_logs
  add column if not exists scrolled_at_hkt timestamp;

delete from public.hkust_stream_logs
where canonical_url !~ '^https://www\.instagram\.com/reels?/[^/]+/?$'
   or canonical_url ~ '^https://www\.instagram\.com/reels?/audio(/|$)';

update public.hkust_stream_logs
set scrolled_at_hkt = scrolled_at at time zone 'Asia/Hong_Kong'
where scrolled_at_hkt is null;

alter table public.hkust_stream_logs
  alter column scrolled_at_hkt set default (now() at time zone 'Asia/Hong_Kong'),
  alter column scrolled_at_hkt set not null;

create or replace function public.set_hkust_scrolled_at_hkt()
returns trigger
language plpgsql
as $$
begin
  new.scrolled_at_hkt := new.scrolled_at at time zone 'Asia/Hong_Kong';
  return new;
end;
$$;

drop trigger if exists hkust_stream_logs_hkt_timestamp on public.hkust_stream_logs;
create trigger hkust_stream_logs_hkt_timestamp
before insert or update of scrolled_at on public.hkust_stream_logs
for each row execute function public.set_hkust_scrolled_at_hkt();

create or replace view public.hkust_stream_logs_hkt
with (security_invoker = true)
as
select
  id,
  participant_id,
  session_id,
  scrolled_at,
  scrolled_at_hkt,
  canonical_url,
  sequence_index,
  is_sponsored
from public.hkust_stream_logs;
