(() => {
  'use strict';

  const BATCH_SIZE = 10;
  const reelIds = new Set();
  let sequenceIndex = 0;
  let pendingRecords = [];
  let trackingEnabled = false;
  let promptRequested = false;

  function readTrackingState() {
    chrome.storage.local.get(['trackingEnabled'], (settings) => {
      trackingEnabled = settings.trackingEnabled === true;
    });
  }

  function canonicalizeReelUrl(href) {
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || !/^\/reels?\//i.test(url.pathname)) {
        return null;
      }
      return `${url.origin}${url.pathname}`;
    } catch {
      return null;
    }
  }

  function isReelsHub() {
    return /^\/reels(?:\/|$)/i.test(window.location.pathname);
  }

  function requestFirstRunPrompt() {
    if (!isReelsHub()) {
      promptRequested = false;
      return;
    }
    if (!trackingEnabled && !promptRequested) {
      promptRequested = true;
      chrome.runtime.sendMessage({ type: 'REELS_DETECTED' });
    }
  }

  function isSponsored(link) {
    let current = link;
    for (let depth = 0; current && depth < 4; depth += 1) {
      const text = (current.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (text.includes('sponsored')) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  function sendPendingRecords() {
    if (pendingRecords.length === 0) {
      return;
    }

    const batch = pendingRecords;
    pendingRecords = [];
    chrome.runtime.sendMessage({ type: 'STREAM_BATCH', records: batch }, () => {
      if (chrome.runtime.lastError) {
        pendingRecords = batch.concat(pendingRecords);
      }
    });
  }

  function inspectLinks(root) {
    if (!trackingEnabled || !isReelsHub()) {
      return;
    }

    const links = [];
    if (root instanceof HTMLAnchorElement) {
      links.push(root);
    }
    if (root.querySelectorAll) {
      links.push(...root.querySelectorAll('a[href*="/reel"]'));
    }

    for (const link of links) {
      const canonicalUrl = canonicalizeReelUrl(link.href);
      if (!canonicalUrl || reelIds.has(canonicalUrl)) {
        continue;
      }

      reelIds.add(canonicalUrl);
      sequenceIndex += 1;
      pendingRecords.push({
        canonical_url: canonicalUrl,
        sequence_index: sequenceIndex,
        is_sponsored: isSponsored(link),
        scrolled_at: new Date().toISOString()
      });

      if (pendingRecords.length >= BATCH_SIZE) {
        sendPendingRecords();
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    requestFirstRunPrompt();
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          inspectLinks(node);
        }
      }
    }
  });

  readTrackingState();
  chrome.storage.local.get(['participantId'], (settings) => {
    if (!settings.participantId) {
      requestFirstRunPrompt();
    }
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.trackingEnabled) {
      trackingEnabled = changes.trackingEnabled.newValue === true;
      if (trackingEnabled) {
        inspectLinks(document.body);
      }
    } else if (areaName === 'local' && changes.participantId) {
      requestFirstRunPrompt();
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    requestFirstRunPrompt();
    inspectLinks(document.body);
  }
})();
