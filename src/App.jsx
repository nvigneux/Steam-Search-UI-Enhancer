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
    setSnowing(!snowing)
    chrome.runtime.sendMessage("Hello from the popup!")
  }

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
      <main>
        <Button
          color="grey"
          type="button"
          size="s"
          onClick={handleSnowingEvent}
        >
          {snowing ? "Disable the snow 🥶" : "Let it snow! ❄️"}
        </Button>
      </main>
    </div>
  )
}

export default App
