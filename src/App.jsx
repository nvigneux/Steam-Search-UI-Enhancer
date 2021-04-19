import React, { useState, useEffect } from "react"

// Components
import ToggleSwitch from "./components/atoms/ToggleSwitch"
import ColorField from "./components/atoms/ColorField"
import Button from "./components/atoms/Button"
import CategoryTitle from "./components/atoms/CategoryTitle"
import Picto from "./components/atoms/Picto/Picto"

// Style
import "./App.css"

function App() {
  const [toggled, toggleColors] = useState(false)

  const [scoreUi, setScoreUi] = useState(false)
  const [styleUi, setStyleUi] = useState(false)
  const [colorsUi, setColorsUi] = useState({})

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
   *
   */
  const handleColorsUiEvent = () => {
    chrome.runtime.sendMessage({ type: "SET_COLORS_UI", colorsUi })
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
    // request actual status
    chrome.runtime.sendMessage({ type: "REQ_SCORE_UI_STATUS" })
    chrome.runtime.sendMessage({ type: "REQ_STYLE_UI_STATUS" })
    chrome.runtime.sendMessage({ type: "REQ_COLORS_UI_STATUS" })
    // listen event of reducer in background.js
    chrome.runtime.onMessage.addListener((message) => {
      switch (message.type) {
        case "SCORE_UI_STATUS":
          setScoreUi(message.scoreUi)
          break
        case "STYLE_UI_STATUS":
          setStyleUi(message.styleUi)
          break
        case "COLORS_UI_STATUS":
          setColorsUi(message.colorsUi)
          break
        default:
          break
      }
    })
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
