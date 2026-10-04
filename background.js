import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  STREAM_TABLE
} from './config.js';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'STREAM_BATCH' || !Array.isArray(message.records)) {
    return false;
  }

  submitBatch(message.records)
    .then(() => sendResponse({ ok: true }))
    .catch(() => sendResponse({ ok: false }));

  return true;
});

async function submitBatch(records) {
  const settings = await chrome.storage.local.get([
    'participantId',
    'trackingEnabled'
  ]);

  if (settings.trackingEnabled !== true || !settings.participantId) {
    return;
  }

  const payload = records.map((record) => ({
    participant_id: settings.participantId,
    scrolled_at: record.scrolled_at,
    canonical_url: record.canonical_url,
    sequence_index: record.sequence_index,
    is_sponsored: record.is_sponsored === true
  }));

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${STREAM_TABLE}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Supabase returned HTTP ${response.status}`);
  }
}
