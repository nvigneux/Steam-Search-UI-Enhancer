const TAB_STORAGE = {};
const INITIAL_STORAGE = {
  scoreUi: true,
  styleUi: true,
  colorsUi: {
    favorable: {
      1: { color: '#7ff44e', label: '> 95%' },
      2: { color: '#2994d6', label: '> 85%' },
      3: { color: '#1c394f', label: '> 80%' },
      4: { color: '#3b3e63', label: '> 70%' },
    },
    mixed: { 1: { color: '#8c8c8c', label: '> 40%' } },
    negative: {
      1: { color: '#c5c53e', label: '> 20%' },
      2: { color: '#c4853d', label: '< 19% + 500000 reviews' },
      3: { color: '#b65f4a', label: '< 19% + 50000 reviews' },
      4: { color: '#cc4848', label: '< 19% + 5000 reviews' },
    },
  },
};
const NETWORK_FILTERS = {
  urls: [
    'https://store.steampowered.com/search',
    '*://store.steampowered.com/search',
    '*://store.steampowered.com/search/*',
  ],
};

/**
 * Sends a message to the background script and all active tabs.
 * @param {any} message - The message to be sent.
 */
const sendTabsMessage = (message) => {
  // send requestStatus to every active tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab?.active) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  });
};

// Ajouter le listener pour l'événement onActivated
chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo ? activeInfo.tabId : chrome.tabs.TAB_ID_NONE;

  // Vérifiez si TAB_STORAGE[tabId] existe, sinon l'initialiser
  if (!TAB_STORAGE[tabId]) {
    TAB_STORAGE[tabId] = {
      id: tabId,
      requests: {},
      registerTime: new Date().getTime(),
    };
  }
});

// onBeforeRequest listener to track search requests
chrome.webRequest.onBeforeRequest.addListener((details) => {
  const { tabId, requestId } = details;
  if (!TAB_STORAGE[tabId]) {
    TAB_STORAGE[tabId] = {
      id: tabId,
      requests: {},
      registerTime: new Date().getTime(),
    };
  }

  TAB_STORAGE[tabId].requests[requestId] = {
    requestId,
    url: details.url,
    startTime: details.timeStamp,
    status: 'pending',
  };
}, NETWORK_FILTERS, ['requestBody']);

// On completed request, update the request status
chrome.webRequest.onCompleted.addListener((details) => {
  const { tabId, requestId } = details;
  if (!TAB_STORAGE[tabId] || !TAB_STORAGE[tabId].requests[requestId]) return;
  const request = TAB_STORAGE[tabId].requests[requestId];

  Object.assign(request, {
    endTime: details.timeStamp,
    requestDuration: details.timeStamp - request.startTime,
    status: 'complete',
  });

  sendTabsMessage({ type: 'REQUEST_SEARCH_COMPLETED', request, tabId });
}, NETWORK_FILTERS);

// onRemoved
chrome.tabs.onRemoved.addListener((tab) => {
  const { tabId } = tab;
  if (!TAB_STORAGE[tabId]) return;

  TAB_STORAGE[tabId] = null;
});

/**
 * Event listener for the onInstalled event.
 * Sets the initial storage value when the extension is installed or updated.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ ...INITIAL_STORAGE });
});

// event reducer to send event to content.js
// listen content and app.jsx
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case 'REQ_COMPLETED_REQUEST_STATUS':
      sendResponse({ status: Object.keys(TAB_STORAGE).length > 0 });
      sendTabsMessage({
        type: 'REQUEST_SEARCH_COMPLETED_STATUS',
        status: Object.keys(TAB_STORAGE).length > 0,
      });
      break;

    case 'REQ_SCORE_UI_STATUS': {
      const storage = await chrome.storage.local.get();

      sendResponse({ scoreUi: storage.scoreUi });
      sendTabsMessage({ type: 'SCORE_UI_STATUS', scoreUi: storage.scoreUi });
      break;
    }

    case 'TOGGLE_SCORE_UI': {
      sendResponse({ scoreUi: message.scoreUi });

      const storage = await chrome.storage.local.get();
      sendTabsMessage({ type: 'SCORE_UI_STATUS', scoreUi: message.scoreUi });
      await chrome.storage.local.set({ ...storage, scoreUi: message.scoreUi });
      break;
    }

    case 'REQ_STYLE_UI_STATUS': {
      const storage = await chrome.storage.local.get();

      sendResponse({ styleUi: storage.styleUi });
      sendTabsMessage({ type: 'STYLE_UI_STATUS', styleUi: storage.styleUi });
      break;
    }

    case 'TOGGLE_STYLE_UI': {
      sendResponse({ styleUi: message.styleUi });

      const storage = await chrome.storage.local.get();
      sendTabsMessage({ type: 'STYLE_UI_STATUS', styleUi: message.styleUi });
      await chrome.storage.local.set({ ...storage, styleUi: message.styleUi });
      break;
    }

    case 'REQ_COLORS_UI_STATUS': {
      const storage = await chrome.storage.local.get();

      sendResponse({ colorsUi: storage.colorsUi });
      sendTabsMessage({ type: 'COLORS_UI_STATUS', colorsUi: storage.colorsUi });
      break;
    }

    case 'SET_COLORS_UI': {
      sendResponse({ colorsUi: message.colorsUi });

      const storage = await chrome.storage.local.get();
      sendTabsMessage({ type: 'COLORS_UI_STATUS', colorsUi: message.colorsUi });
      await chrome.storage.local.set({ ...storage, colorsUi: message.colorsUi });
      break;
    }

    default:
      break;
  }
  return true;
});
