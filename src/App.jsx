/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react"

// Components
import ToggleSwitch from "./components/atoms/ToggleSwitch"
import ColorField from "./components/atoms/ColorField"
import Button from "./components/atoms/Button"
import CategoryTitle from "./components/atoms/CategoryTitle"

// Style
import "./App.css"
import Picto from "./components/atoms/Picto/Picto"

function App() {
  const [toggled, toggleColors] = useState(false)

  // const [url, setUrl] = useState("")
  const [scoreUi, setScoreUi] = useState(false)
  const [styleUi, setStyleUi] = useState(false)
  // const [colorsUi, setColorsUi] = useState({})
  const [colorsUi, setColorsUi] = useState({
    favorable: {
      1: { color: "#68b04a", label: "> 95%" },
      2: { color: "#4b83b3", label: "> 85%" },
      3: { color: "#a947c7", label: "> 80%" },
      4: { color: "#714cc7", label: "> 70%" },
    },
    mixed: { 1: { color: "#b8b8b8", label: "> 40%" } },
    negative: {
      1: { color: "#68b04a", label: "> 20%" },
      2: { color: "#4b83b3", label: "< 19% + 500000 reviews" },
      3: { color: "#a947c7", label: "< 19% + 50000 reviews" },
      4: { color: "#714cc7", label: "< 19% + 5000 reviews" },
    },
  })

  /**
   *
   */
  const handleScoreEvent = () => {
    // chrome.runtime.sendMessage({ type: "TOGGLE_SCORE_UI", scoreUi: !scoreUi })
  }

  /**
   *
   */
  const handleStyleEvent = () => {
    // chrome.runtime.sendMessage({ type: "TOGGLE_STYLE_UI", styleUi: !styleUi })
  }

  /**
   *
   */
  const handleColorsUiEvent = () => {
    // chrome.runtime.sendMessage({ type: "SET_COLORS_UI", colorsUi })
  }

  /**
   *
   * @param {*} color
   * @param {*} name
   */
  const handleColorsUi = (color, name) => {
    const nameColor = name.split("-")
    const newColorsUi = {
      ...colorsUi,
      [nameColor[0]]: {
        ...colorsUi[nameColor[0]],
        [nameColor[1]]: { ...colorsUi[nameColor[0]][nameColor[1]], color },
      },
    }
    setColorsUi(newColorsUi)
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
    // request actual status
    // chrome.runtime.sendMessage({ type: "REQ_SCORE_UI_STATUS" })
    // chrome.runtime.sendMessage({ type: "REQ_STYLE_UI_STATUS" })
    // chrome.runtime.sendMessage({ type: "REQ_COLORS_UI_STATUS" })
    // // listen event of reducer in background.js
    // chrome.runtime.onMessage.addListener((message) => {
    //   switch (message.type) {
    //     case "SCORE_UI_STATUS":
    //       setScoreUi(message.scoreUi)
    //       break
    //     case "STYLE_UI_STATUS":
    //       setStyleUi(message.styleUi)
    //       break
    //     case "COLORS_UI_STATUS":
    //       setColorsUi(message.colorsUi)
    //       break
    //     default:
    //       break
    //   }
    // })
  }, [])

  return (
    <div className="sbui">
      <main className="sbui-main">
        <div className="sbui-cat">
          <CategoryTitle title="Score UI">
            <ToggleSwitch
              id="scoreUi"
              name="scoreUi"
              onChange={handleScoreEvent}
              toggled={scoreUi}
            />
          </CategoryTitle>
        </div>
        <span className="sbui-separator" />
        <div className="sbui-cat">
          <CategoryTitle title="Style UI">
            <ToggleSwitch
              id="styleUi"
              name="styleUi"
              onChange={handleStyleEvent}
              toggled={styleUi}
            />
          </CategoryTitle>
          <CategoryTitle title="Color UI">
            <Button
              type="button"
              size="s"
              color="transparent"
              onClick={() => toggleColors(!toggled)}
            >
              {toggled ? (
                <Picto icon="arrowDown" style={{ height: "7px", top: "2px" }} />
              ) : (
                <Picto
                  icon="arrowDown"
                  style={{
                    height: "7px",
                    top: "1px",
                    transform: "rotate(-90deg)",
                  }}
                />
              )}
            </Button>
          </CategoryTitle>
          {toggled ? (
            <div>
              {colorsUi && Object.keys(colorsUi).length > 0
                ? Object.keys(colorsUi).map((colorName) => (
                    <div key={colorName} className="sbui-cat__color">
                      {Object.keys(colorsUi[colorName]).map((colorNum) => (
                        <ColorField
                          key={`${colorName}-${colorNum}`}
                          name={`${colorName}-${colorNum}`}
                          value={colorsUi[colorName][colorNum].color}
                          label={colorsUi[colorName][colorNum].label}
                          onChange={handleColorsUi}
                        />
                      ))}
                    </div>
                  ))
                : null}
              <div className="sbui-cat__button">
                <Button
                  onClick={handleColorsUiEvent}
                  color="primary"
                  type="button"
                  size="s"
                >
                  Save colors
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default App
