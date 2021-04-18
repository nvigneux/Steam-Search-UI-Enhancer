/**
 * webRequest
 */

/**
 *
 * @param {string} type
 * @param {object} payload
 */
const sendTabsMessage = (message) => {
  chrome.runtime.sendMessage(message)

  // send requestStatus to every active tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) chrome.tabs.sendMessage(tab.id, message)
    })
  })
}

const tabStorage = {}
const networkFilters = {
  urls: [
    "*://store.steampowered.com/search",
    "*://store.steampowered.com/search/*",
  ],
}

// onActivated
chrome.tabs.onActivated.addListener((tab) => {
  const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE
  if (!tabStorage[tabId]) {
    tabStorage[tabId] = {
      id: tabId,
      requests: {},
      registerTime: new Date().getTime(),
    }
  }
})

// onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener((details) => {
  const { tabId, requestId } = details
  if (!tabStorage[tabId]) return

  tabStorage[tabId].requests[requestId] = {
    requestId,
    url: details.url,
    startTime: details.timeStamp,
    status: "pending",
  }
}, networkFilters)

// onCompleted
chrome.webRequest.onCompleted.addListener((details) => {
  const { tabId, requestId } = details
  if (!tabStorage[tabId] || !tabStorage[tabId].requests[requestId]) return

  const request = tabStorage[tabId].requests[requestId]

  Object.assign(request, {
    endTime: details.timeStamp,
    requestDuration: details.timeStamp - request.startTime,
    status: "complete",
  })

  sendTabsMessage({ type: "REQUEST_SEARCH_COMPLETED", request })

  console.log(tabStorage[tabId].requests[details.requestId])
}, networkFilters)

// onRemoved
chrome.tabs.onRemoved.addListener((tab) => {
  const { tabId } = tab
  if (!tabStorage[tabId]) return

  tabStorage[tabId] = null
})

/**
 * onMessage
 * Snowing
 */

let scoreUi = false
let styleUi = false

// Get locally stored value
// chrome.storage.local.get("scoreUi", (res) => !!res.scoreUi)

// Get locally stored value
chrome.storage.local.get("scoreUi", (res) => {
  scoreUi = !!res.scoreUi
})

chrome.storage.local.get("styleUi", (res) => {
  styleUi = !!res.styleUi
})

// event reducer to send event to content.js
// listen content and app.jsx
chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "REQ_SCORE_UI_STATUS":
      sendTabsMessage({ type: "SCORE_UI_STATUS", scoreUi })
      break
    case "REQ_STYLE_UI_STATUS":
      sendTabsMessage({ type: "STYLE_UI_STATUS", styleUi })
      break
    case "TOGGLE_SCORE_UI":
      scoreUi = message.scoreUi
      chrome.storage.local.set({ scoreUi })
      sendTabsMessage({ type: "SCORE_UI_STATUS", scoreUi })
      break
    case "TOGGLE_STYLE_UI":
      styleUi = message.styleUi
      chrome.storage.local.set({ styleUi })
      sendTabsMessage({ type: "STYLE_UI_STATUS", styleUi })
      break
    case "REQ_COMPLETED_REQUEST_STATUS":
      sendTabsMessage({
        type: "REQUEST_SEARCH_COMPLETED_STATUS",
        status: Object.keys(tabStorage).length > 0,
      })
      break
    default:
      break
  }
})
