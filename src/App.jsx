/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"

// Components
import Button from "./components/atoms/Button"

function App() {
  const [url, setUrl] = useState("")
  const [snowing, setSnowing] = React.useState(true)

  const handleSnowingEvent = () => {
    chrome.runtime.sendMessage({ type: "TOGGLE_SNOW", snowing: !snowing })
  }

  /**
   * Get current URL
   */
  useEffect(() => {
    // Get url for the active tab
    const queryInfo = { active: true, lastFocusedWindow: true }
    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const { url } = tabs[0]
        setUrl(url)
      })

    // request actual status for snowing
    chrome.runtime.sendMessage({ type: "REQ_SNOW_STATUS" })
    // listen event of reducer in background.js
    chrome.runtime.onMessage.addListener((message) => {
      switch (message.type) {
        case "SNOW_STATUS":
          setSnowing(message.snowing)
          break
        default:
          break
      }
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>URL:</p>
        <p>{url}</p>
        <Button
          color="grey"
          type="button"
          size="s"
          onClick={handleSnowingEvent}
        >
          {snowing ? "Disable the snow 🥶" : "Let it snow! ❄️"}
        </Button>
      </header>
    </div>
  )
}

export default App
