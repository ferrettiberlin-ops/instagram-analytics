alter table public.hkust_research_profiles
  drop constraint if exists hkust_research_profiles_age_bracket_check,
  drop constraint if exists hkust_research_profiles_cultural_identity_check,
  drop constraint if exists hkust_research_profiles_hkust_school_check;

alter table public.hkust_research_profiles
  alter column age_bracket type varchar(255) using age_bracket::varchar(255),
  alter column cultural_identity type varchar(255) using cultural_identity::varchar(255),
  alter column hkust_school type varchar(255) using hkust_school::varchar(255),
  add column if not exists ideological_alignment varchar(255);

update public.hkust_research_profiles
set ideological_alignment = 'Prefer not to say'
where ideological_alignment is null;

alter table public.hkust_research_profiles
  alter column ideological_alignment set not null;
