/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"

function App() {
  const [url, setUrl] = useState("")

  /**
   * Get current URL
   */
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true }

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const { url } = tabs[0]
        setUrl(url)
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
      </header>
    </div>
  )
}

export default App
