import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const ingestToken = Deno.env.get('STUDY_INGEST_TOKEN');
const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-study-ingest-token, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*'
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function requiredString(value: unknown, field: string, maxLength: number) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) {
    throw new Error(`Invalid ${field}`);
  }
  return value.trim();
}

function validateProfile(profile: Record<string, unknown>) {
  return {
    participant_id: requiredString(profile.participant_id, 'participant_id', 64),
    age_bracket: requiredString(profile.age_bracket, 'age_bracket', 255),
    cultural_identity: requiredString(profile.cultural_identity, 'cultural_identity', 255),
    hkust_school: requiredString(profile.hkust_school, 'hkust_school', 255),
    ideological_alignment: requiredString(profile.ideological_alignment, 'ideological_alignment', 255),
    consent_version: requiredString(profile.consent_version, 'consent_version', 64),
    consented_at: requiredString(profile.consented_at, 'consented_at', 64)
  };
}

function validateRecords(records: unknown[]) {
  if (records.length === 0 || records.length > 100) {
    throw new Error('records must contain between 1 and 100 items');
  }

  return records.map((record) => {
    if (!record || typeof record !== 'object') {
      throw new Error('Invalid stream record');
    }
    const value = record as Record<string, unknown>;
    const canonicalUrl = requiredString(value.canonical_url, 'canonical_url', 2048);
    const parsedUrl = new URL(canonicalUrl);
    if (parsedUrl.origin !== 'https://www.instagram.com' || !/^\/reels?\/.+/i.test(parsedUrl.pathname)) {
      throw new Error('Invalid canonical_url');
    }
    const sequenceIndex = value.sequence_index;
    if (!Number.isInteger(sequenceIndex) || sequenceIndex < 1) {
      throw new Error('Invalid sequence_index');
    }
    const sessionId = requiredString(value.session_id, 'session_id', 36);
    if (!/^[0-9a-f-]{36}$/i.test(sessionId)) {
      throw new Error('Invalid session_id');
    }
    const scrolledAt = requiredString(value.scrolled_at, 'scrolled_at', 64);
    if (Number.isNaN(Date.parse(scrolledAt))) {
      throw new Error('Invalid scrolled_at');
    }
    return {
      canonical_url: canonicalUrl,
      is_sponsored: value.is_sponsored === true,
      scrolled_at: scrolledAt,
      sequence_index: sequenceIndex,
      session_id: sessionId
    };
  });
}

async function insert(table: string, payload: unknown, prefer = 'return=minimal') {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey!,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: prefer
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok && response.status !== 409) {
    throw new Error(`Database insert failed with HTTP ${response.status}`);
  }
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }
  if (!supabaseUrl || !serviceRoleKey || !ingestToken || request.headers.get('x-study-ingest-token') !== ingestToken) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await request.json();
    const participantId = requiredString(body.participant_id, 'participant_id', 64);
    if (body.type === 'profile') {
      const profile = validateProfile(body.profile || {});
      if (profile.participant_id !== participantId) {
        throw new Error('participant_id mismatch');
      }
      await insert('hkust_research_profiles', profile, 'resolution=ignore-duplicates,return=minimal');
      await insert('hkust_consent_records', {
        participant_id: participantId,
        consent_version: profile.consent_version,
        consented_at: profile.consented_at
      }, 'resolution=ignore-duplicates,return=minimal');
      return jsonResponse({ ok: true });
    }
    if (body.type === 'stream') {
      const records = validateRecords(body.records);
      await insert('hkust_stream_logs', records.map((record) => ({ ...record, participant_id: participantId })));
      return jsonResponse({ ok: true });
    }
    return jsonResponse({ error: 'Unsupported payload type' }, 400);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Invalid request' }, 400);
  }
});
