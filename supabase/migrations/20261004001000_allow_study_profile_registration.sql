create policy "study clients can register profiles"
  on public.hkust_research_profiles
  for insert
  to anon, authenticated
  with check (true);
