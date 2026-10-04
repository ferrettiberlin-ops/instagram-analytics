alter policy "study clients can register profiles"
  on public.hkust_research_profiles
  to public;

alter policy "study clients can append stream logs"
  on public.hkust_stream_logs
  to public;