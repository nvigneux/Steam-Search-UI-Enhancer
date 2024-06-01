/**
 * webRequest
 */

const tabStorage = {};
const networkFilters = {
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

  // Vérifiez si tabStorage[tabId] existe, sinon l'initialiser
  if (!tabStorage[tabId]) {
    tabStorage[tabId] = {
      id: tabId,
      requests: {},
      registerTime: new Date().getTime(),
    };
  }
});

// onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener((details) => {
  const { tabId, requestId } = details;
  if (!tabStorage[tabId]) {
    tabStorage[tabId] = {
      id: tabId,
      requests: {},
      registerTime: new Date().getTime(),
    };
  }

  tabStorage[tabId].requests[requestId] = {
    requestId,
    url: details.url,
    startTime: details.timeStamp,
    status: 'pending',
  };
}, networkFilters, ['requestBody']);

// onCompleted
chrome.webRequest.onCompleted.addListener((details) => {
  const { tabId, requestId } = details;
  if (!tabStorage[tabId] || !tabStorage[tabId].requests[requestId]) return;

  const request = tabStorage[tabId].requests[requestId];

  Object.assign(request, {
    endTime: details.timeStamp,
    requestDuration: details.timeStamp - request.startTime,
    status: 'complete',
  });

  sendTabsMessage({ type: 'REQUEST_SEARCH_COMPLETED', request, tabId });
}, networkFilters);

// onRemoved
chrome.tabs.onRemoved.addListener((tab) => {
  const { tabId } = tab;
  if (!tabStorage[tabId]) return;

  tabStorage[tabId] = null;
});

/**
 * onMessage
 * Snowing
 */

let scoreUi = false;
let styleUi = false;
let colorsUi = {
  favorable: {
    1: { color: '#68b04a', label: '> 95%' },
    2: { color: '#4b83b3', label: '> 85%' },
    3: { color: '#a947c7', label: '> 80%' },
    4: { color: '#714cc7', label: '> 70%' },
  },
  mixed: { 1: { color: '#b8b8b8', label: '> 40%' } },
  negative: {
    1: { color: '#c5c53e', label: '> 20%' },
    2: { color: '#c4853d', label: '< 19% + 500000 reviews' },
    3: { color: '#b65f4a', label: '< 19% + 50000 reviews' },
    4: { color: '#cc4848', label: '< 19% + 5000 reviews' },
  },
};

/**
 * Event listener for the onInstalled event.
 * Sets the initial storage value when the extension is installed or updated.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ scoreUi, styleUi, colorsUi });
});

// event reducer to send event to content.js
// listen content and app.jsx
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case 'REQ_COMPLETED_REQUEST_STATUS':
      sendResponse({ status: Object.keys(tabStorage).length > 0 });
      sendTabsMessage({
        type: 'REQUEST_SEARCH_COMPLETED_STATUS',
        status: Object.keys(tabStorage).length > 0,
      });
      break;

    case 'REQ_SCORE_UI_STATUS':
      sendResponse({ scoreUi });
      sendTabsMessage({ type: 'SCORE_UI_STATUS', scoreUi });
      break;

    case 'TOGGLE_SCORE_UI':
      scoreUi = message.scoreUi;
      chrome.storage.local.set({ scoreUi });

      sendResponse({ scoreUi });
      sendTabsMessage({ type: 'SCORE_UI_STATUS', scoreUi });
      break;

    case 'REQ_STYLE_UI_STATUS':
      sendResponse({ styleUi });
      sendTabsMessage({ type: 'STYLE_UI_STATUS', styleUi });
      break;

    case 'TOGGLE_STYLE_UI':
      styleUi = message.styleUi;
      chrome.storage.local.set({ styleUi });

      sendResponse({ styleUi });
      sendTabsMessage({ type: 'STYLE_UI_STATUS', styleUi });
      break;

    case 'REQ_COLORS_UI_STATUS':
      sendResponse({ colorsUi });
      sendTabsMessage({ type: 'COLORS_UI_STATUS', colorsUi });
      break;

    case 'SET_COLORS_UI':
      colorsUi = message.colorsUi;
      chrome.storage.local.set({ colorsUi });

      sendResponse({ colorsUi });
      sendTabsMessage({ type: 'COLORS_UI_STATUS', colorsUi });
      break;

    default:
      break;
  }
  return true;
});
