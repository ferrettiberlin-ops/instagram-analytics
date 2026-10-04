const setupView = document.querySelector('#setup-view');
const activeView = document.querySelector('#active-view');
const participantInput = document.querySelector('#participant-id');
const activeParticipant = document.querySelector('#active-participant');
const disableButton = document.querySelector('#disable-tracking');
const message = document.querySelector('#message');

function showMessage(text) {
  message.textContent = text;
}

function render(settings) {
  const active = settings.trackingEnabled === true && Boolean(settings.participantId);
  setupView.hidden = active;
  activeView.hidden = !active;
  activeParticipant.textContent = active ? `Participant ID: ${settings.participantId}` : '';
  if (active) {
    participantInput.value = settings.participantId;
  }
}

chrome.storage.local.get(['participantId', 'trackingEnabled'], render);

setupView.addEventListener('submit', async (event) => {
  event.preventDefault();
  const participantId = participantInput.value.trim();
  if (!participantId) {
    showMessage('Enter the assigned Participant ID.');
    return;
  }

  try {
    await chrome.storage.local.set({ participantId, trackingEnabled: true });
    render({ participantId, trackingEnabled: true });
    showMessage('');
    await refreshInstagramTab();
  } catch {
    showMessage('Unable to enable tracking. Try again.');
  }
});

disableButton.addEventListener('click', async () => {
  try {
    await chrome.storage.local.set({ trackingEnabled: false });
    render({ participantId: participantInput.value.trim(), trackingEnabled: false });
    showMessage('Tracking disabled.');
  } catch {
    showMessage('Unable to disable tracking. Try again.');
  }
});

async function refreshInstagramTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  if (activeTab?.id && activeTab.url?.startsWith('https://www.instagram.com/')) {
    await chrome.tabs.reload(activeTab.id);
  }
}
