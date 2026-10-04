# HKUST SOSC 3000L Onboarding Questionnaire Guideline

## Enrollment Use

Use this guide during manual, face-to-face enrollment for the SOSC 3000L algorithmic auditing study. Read the participant information sheet and obtain informed consent before entering any response or enabling the extension. Participation is voluntary. Do not infer or edit a participant's answer.

The intake records four research variables used to compare demographic independent variables with chronological Instagram Reel stream sequences:

1. **Age bracket**: campus life-cycle control variable.
2. **Expanded cultural identity**: cross-cultural and globally mobile network-routing variable.
3. **Institutional affiliation / school**: disciplinary peer-group variable.
4. **Ideological alignment: political / social stance**: neutral self-positioning variable for echo-chamber analysis.

The participant also supplies an **HKUST SID** for study linkage. The SID is a direct identifier and must be handled under the approved HAREC protocol.

## Intake Fields

### 1. Age Bracket

**Prompt:** Which age bracket best describes you?

**Standard values:**

- `Under 18`
- `18–20`
- `21–23`
- `24–26`
- `27+`
- `Other (Please specify)`

When `Other (Please specify)` is selected, record the participant's free-text response in the same `age_bracket` field.

### 2. Expanded Cultural Identity

**Prompt:** Which cultural identity category best describes your background? You may select an open-ended response or prefer not to say.

**Standard values:**

- `Local HK` — Local HK Resident, Chinese Heritage
- `Ethnic Minority` — Generational HK Resident, South/Southeast Asian or non-Chinese heritage
- `Immigrant` — Long-term family relocation or resettlement
- `Expat` — Transient corporate, diplomatic, or academic contract bubble
- `TCK` — Third Culture Kid; globally mobile lifestyle or international schooling background
- `International — Asian` — Non-local regional student or APAC regional exchange
- `International — European` — European degree-seeking or exchange student
- `International — North American` — North American degree-seeking or exchange student
- `International — African` — African degree-seeking or exchange student
- `International — Latin American` — Latin American degree-seeking or exchange student
- `Prefer not to say`
- `Other / Mixed Background (Please specify)`

When `Other / Mixed Background (Please specify)` is selected, record the participant's free-text response in the same `cultural_identity` field.

### 3. Institutional Affiliation / School

**Prompt:** Which institutional affiliation or school best describes your current study pathway?

**Standard values:**

- `SENG`
- `SSCI`
- `SBM`
- `SHSS`
- `Exchange Student`
- `Other / Interdisciplinary Major (Please specify)`

When `Other / Interdisciplinary Major (Please specify)` is selected, record the participant's free-text response in the same `hkust_school` field. This supports IPO, AIS, and dual-degree pathways.

### 4. Ideological Alignment: Political / Social Stance

**Prompt:** Which description best represents your political or social stance? This is a neutral, academic self-positioning question; there are no correct answers.

**Standard values:**

- `Progressive / Liberal / Left-leaning`
- `Moderate / Centrist`
- `Conservative / Right-leaning`
- `Apolitical / Generally Uninterested`
- `Prefer not to say`
- `My stance is best described as (Please specify)`

When `My stance is best described as (Please specify)` is selected, record the participant's free-text response in the same `ideological_alignment` field.

## Data-Entry Rules

- Store the selected standard label exactly as written above.
- For an open-ended option, store only the participant's specified text in the corresponding database column; do not concatenate the prompt or option label.
- Do not create new columns for individual “Other” responses.
- Keep all four fields as text values. Database validation enforces presence and length, not a closed enumeration.
- Do not enter names, ITSC email addresses, phone numbers, or unrequested notes in any field.
- Confirm informed consent before selecting **Enable tracking**.
