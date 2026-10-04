# HKUST Reel Viewing Study Extension

Manifest V3 Chrome extension for the HKUST SOSC 3000L academic study. The participant enters an assigned ID in the private extension popup. While enabled, the isolated-world content script observes newly painted Instagram links, records canonical Reel URLs in chronological discovery order, and sends batches to the extension service worker. Only the service worker makes Supabase requests.

## Configure Supabase

1. Run `schema.sql` in the Supabase SQL editor.
2. Copy `.env.example` to `.env.local` and set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and optionally `SUPABASE_STREAM_TABLE`.
3. Run `npm run build:config` to generate the ignored `config.js` consumed by the service worker.
4. Configure Supabase RLS policies for the approved study deployment before distributing the extension. The SQL file intentionally enables RLS without inventing an access policy.

The extension must not be distributed with a service-role key. The anon key is not a secret; database authorization belongs in Supabase RLS and any required server-side controls.

## Load in Chrome

1. Run `npm run build:config` after creating `.env.local`.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this directory.
5. Open Instagram, open the extension popup, enter the assigned Participant ID, and enable tracking.
6. Use the popup's **Disable tracking** control to stop collection.

The extension is intentionally limited to the Instagram Reels experience at `/reels/` and `/reels/<id>/` and does not inject page UI. It ignores feed, profile, explore, and search pages. It uses a passive `MutationObserver`; it does not intercept network traffic or attempt to bypass Instagram controls.

On the first visit to `/reels/`, the extension opens a private onboarding tab for the HKUST SID, age bracket, cultural identity, and HKUST school. The profile is submitted before tracking is enabled. Later visits go directly to tracking unless the participant disables it.
