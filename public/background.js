// dispatch snow status
const sendSnowStatus = (snowing) => {
  const message = { type: "SNOW_STATUS", snowing }
  chrome.runtime.sendMessage(message)

  // send message to every active tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) chrome.tabs.sendMessage(tab.id, message)
    })
  })
}

let snowing = false

// Get locally stored value
chrome.storage.local.get("snowing", (res) => !!res.snowing)

// event reducer to send event to content.js
chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "REQ_SNOW_STATUS":
      sendSnowStatus(snowing)
      break
    case "TOGGLE_SNOW":
      snowing = message.snowing
      chrome.storage.local.set({ snowing })
      sendSnowStatus(snowing)
      break
    default:
      break
  }
})
