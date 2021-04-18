/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"

// Components
import Button from "./components/atoms/Button"

function App() {
  // const [url, setUrl] = useState("")
  const [scoreUi, setScoreUi] = useState(true)
  const [styleUi, setStyleUi] = useState(true)

  /**
   *
   */
  const handleScoreEvent = () => {
    chrome.runtime.sendMessage({ type: "TOGGLE_SCORE_UI", scoreUi: !scoreUi })
  }
  /**
   *
   */
  const handleStyleEvent = () => {
    chrome.runtime.sendMessage({ type: "TOGGLE_STYLE_UI", styleUi: !styleUi })
  }

  /**
   * Get current URL
   */
  useEffect(() => {
    // Get url for the active tab
    // const queryInfo = { active: true, lastFocusedWindow: true }
    // chrome.tabs &&
    //   chrome.tabs.query(queryInfo, (tabs) => {
    //     const { url } = tabs[0]
    //     setUrl(url)
    //   })

    // request actual status for scoreUi
    chrome.runtime.sendMessage({ type: "REQ_SCORE_UI_STATUS" })
    chrome.runtime.sendMessage({ type: "REQ_STYLE_UI_STATUS" })
    // listen event of reducer in background.js
    chrome.runtime.onMessage.addListener((message) => {
      switch (message.type) {
        case "SCORE_UI_STATUS":
          setScoreUi(message.scoreUi)
          break
        case "STYLE_UI_STATUS":
          setStyleUi(message.styleUi)
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
        <p>URL:</p>
        <p>{`${scoreUi}`}</p>
        <p>{`${styleUi}`}</p>
        <Button color="grey" type="button" size="s" onClick={handleScoreEvent}>
          {scoreUi ? "Disable Score UI" : "Score UI"}
        </Button>
        <Button color="grey" type="button" size="s" onClick={handleStyleEvent}>
          {styleUi ? "Disable Style UI" : "Style UI"}
        </Button>
      </header>
    </div>
  )
}

export default App
