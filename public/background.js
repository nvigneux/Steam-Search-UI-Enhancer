const sendSnowStatus = (snowing) => {
  chrome.runtime.sendMessage({ type: "SNOW_STATUS", snowing })
}

let snowing = false

// Get locally stored value
chrome.storage.local.get("snowing", (res) => !!res.snowing)

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
