import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  STREAM_TABLE
} from './config.js';

const CONSENT_VERSION = '2026-10-04-v1';
let onboardingTabId = null;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'REELS_DETECTED') {
    openOnboardingTab();
    return false;
  }

  if (message?.type === 'PROFILE_SETUP' && message.profile) {
    saveProfile(message.profile)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type !== 'STREAM_BATCH' || !Array.isArray(message.records)) {
    return false;
  }

  submitBatch(message.records)
    .then(() => sendResponse({ ok: true }))
    .catch(() => sendResponse({ ok: false }));

  return true;
});

async function openOnboardingTab() {
  const settings = await chrome.storage.local.get(['participantId']);
  if (settings.participantId || onboardingTabId !== null) {
    return;
  }

  const tab = await chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html?onboarding=1')
  });
  onboardingTabId = tab.id;
}

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === onboardingTabId) {
    onboardingTabId = null;
  }
});

async function saveProfile(profile) {
  const profilePayload = {
    ...profile,
    consent_version: CONSENT_VERSION,
    consented_at: new Date().toISOString()
  };
  const response = await fetch(`${SUPABASE_URL}/rest/v1/hkust_research_profiles`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(profilePayload)
  });

  if (response.status === 409) {
    await saveConsentRecord(profile.participant_id);
    return;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase profile request returned HTTP ${response.status}: ${details}`);
  }

  await saveConsentRecord(profile.participant_id);
}

async function saveConsentRecord(participantId) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/hkust_consent_records`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      participant_id: participantId,
      consent_version: CONSENT_VERSION,
      consented_at: new Date().toISOString()
    })
  });

  if (response.status === 409 || response.ok) {
    return;
  }

  const details = await response.text();
  throw new Error(`Supabase consent request returned HTTP ${response.status}: ${details}`);
}

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
    session_id: record.session_id,
    scrolled_at: record.scrolled_at,
    canonical_url: record.canonical_url,
    sequence_index: record.sequence_index,
    is_sponsored: record.is_sponsored === true
  }));

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${STREAM_TABLE}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Supabase returned HTTP ${response.status}`);
  }
}
