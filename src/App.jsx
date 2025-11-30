/* eslint-disable no-debugger */
import { useState, useEffect } from 'react';

// Components
import ToggleSwitch from './components/atoms/ToggleSwitch/ToggleSwitch';
import ColorField from './components/atoms/ColorField/ColorField';
import Button from './components/atoms/Button/Button';
import CategoryTitle from './components/atoms/CategoryTitle/CategoryTitle';
import Picto from './components/atoms/Picto/Picto';

// Style
import './App.css';

function App() {
  const [toggled, toggleColors] = useState(false);

  const [scoreUi, setScoreUi] = useState(false);
  const [styleUi, setStyleUi] = useState(false);
  const [colorsUi, setColorsUi] = useState({});

  /**
   * Handles the score event by sending a message to the Chrome runtime.
   */
  const handleScoreEvent = async () => {
    const res = await chrome.runtime.sendMessage({ type: 'TOGGLE_SCORE_UI', scoreUi: !scoreUi });
    setScoreUi(res.scoreUi);
  };

  /**
   * Handles the style event by sending a message to the Chrome runtime.
   * @returns {void}
   */
  const handleStyleEvent = async () => {
    const res = await chrome.runtime.sendMessage({ type: 'TOGGLE_STYLE_UI', styleUi: !styleUi });
    setStyleUi(res.styleUi);
  };

  /**
   * Handles the colors UI event.
   */
  const handleColorsUiEvent = async () => {
    const res = await chrome.runtime.sendMessage({ type: 'SET_COLORS_UI', colorsUi });
    setColorsUi(res.colorsUi);
  };

  /**
   * Handles the UI colors based on the provided color and name.
   *
   * @param {string} color - The color value to be applied.
   * @param {string} name - The name used to identify the UI element.
   */
  const handleColorsUi = (color, name) => {
    const nameColor = name.split('-');
    const newColorsUi = {
      ...colorsUi,
      [nameColor[0]]: {
        ...colorsUi[nameColor[0]],
        [nameColor[1]]: { ...colorsUi[nameColor[0]][nameColor[1]], color },
      },
    };
    setColorsUi(newColorsUi);
  };

  /**
   * Get current URL
   */
  useEffect(() => {
    // request actual status
    if (typeof chrome?.storage?.local?.get() !== 'function') return;

    chrome.storage.local.get().then((storage) => {
      setScoreUi(storage.scoreUi);
      setStyleUi(storage.styleUi);
      setColorsUi(storage.colorsUi);
    });
  }, []);

  return (
    <div className="sbui">
      <header className="sbui-radial">
        <h1 className="sbui-title">Steam Better UI 2</h1>
      </header>
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
                <Picto icon="arrowDown" style={{ height: '7px', top: '2px' }} />
              ) : (
                <Picto
                  icon="arrowDown"
                  style={{
                    height: '7px',
                    top: '1px',
                    transform: 'rotate(-90deg)',
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
                  size="m"
                >
                  Save colors
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default App;
