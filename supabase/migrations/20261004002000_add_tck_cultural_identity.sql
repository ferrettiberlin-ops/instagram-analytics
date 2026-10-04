alter table public.hkust_research_profiles
  drop constraint if exists hkust_research_profiles_cultural_identity_check;

alter table public.hkust_research_profiles
  add constraint hkust_research_profiles_cultural_identity_check
  check (cultural_identity in (
    'Local Hong Kong Resident (Chinese Heritage)',
    'Local Hong Kong Resident (Generational Ethnic Minority)',
    'Expatriate',
    'Immigrant / First-Generation Resettlement',
    'Third Culture Kid (TCK)'
  ));
