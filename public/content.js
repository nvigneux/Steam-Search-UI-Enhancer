/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
const regexNumber = /(\d{0,3},)?(\d{3},)?(\d+)/g

/**
 * Sets attributes on an element.
 *
 * @param {Element} el - The element to set attributes on.
 * @param {Object} attrs - An object containing attribute key-value pairs.
 */
const setAttributes = (el, attrs) => {
  Object.keys(attrs).forEach((key) => {
    if (key && attrs[key]) el.setAttribute(key, attrs[key])
  })
}

/**
 * Removes specified attributes from an element.
 *
 * @param {Element} el - The element from which to remove attributes.
 * @param {Array<string>} attrs - An array of attribute names to remove.
 * @returns {void}
 */
const deleteAttributes = (el, attrs) => {
  attrs.forEach((key) => {
    if (key) el.removeAttribute(key)
  })
}

/**
 * Steam rating UI
 */

// Const init
let scoreUi = false
let styleUi = false
let colorsUi = {}


/**
 * Determines the color for a review based on the given percent and number of reviews.
 *
 * @param {number} percent - The percentage value of the review.
 * @param {number} reviews - The number of reviews.
 * @returns {string} The color value for the review.
 */
const reviewColor = (percent, reviews) => {
  if (percent <= 100 && percent >= 95) return "var(--color-favorable-1)"
  if (percent <= 95 && percent >= 85) return "var(--color-favorable-2)"
  if (percent <= 85 && percent >= 80) return "var(--color-favorable-3)"
  if (percent <= 79 && percent >= 70) return "var(--color-favorable-4)"
  if (percent <= 69 && percent >= 40) return "var(--color-mixed-1)"
  if (percent <= 39 && percent >= 20) return "var(--color-negative-4)"
  if (percent <= 19 && percent >= 0 && reviews >= 500000)
    return "var(--color-negative-3"
  if (percent <= 19 && percent >= 0 && reviews <= 500000 && reviews >= 50000)
    return "var(--color-negative-2"
  if (percent <= 19 && percent >= 0 && reviews <= 50000 && reviews >= 1)
    return "var(--color-negative-1"
}

// Prepend / Remove DOM


/**
 * Prepends a score UI element to a given row.
 *
 * @param {HTMLElement} row - The row element to prepend the score UI to.
 * @param {Object} scoreData - The score data object containing the percent and reviews.
 */
const prependScoreUI = (row, { percent, reviews }) => {
  const div = document.createElement("div")
  const container = row.querySelector(
    ".search_reviewscore.responsive_secondrow"
  )
  const img = row.querySelector(".search_capsule img")
  setAttributes(container, {
    style: `position:relative;`,
  })
  setAttributes(img, {
    style: "position:relative;transform: translate(0, 15%);",
  })

  div.className = "steam-better-ui-score-ui"
  div.innerHTML += `${percent}% - ${reviews} reviews`
  container.appendChild(div)
}


/**
 * Adds a custom style to a row element based on the provided percent and reviews.
 * @param {HTMLElement} row - The row element to add the style to.
 * @param {Object} options - The options object containing the percent and reviews values.
 * @param {number} options.percent - The percentage value.
 * @param {string} options.reviews - The reviews value.
 */
const prependStyleUI = (row, { percent, reviews }) => {
  row.classList.add("steam-better-ui-border")
  setAttributes(row, {
    style: `border-right-color: ${reviewColor(
      Number(percent),
      Number(reviews.replace(/,/g, ""))
    )} !important`,
  })
}


/**
 * Removes the score UI from a given row element.
 *
 * @param {HTMLElement} row - The row element containing the score UI.
 */
const removeScoreUI = (row) => {
  const container = row.querySelector(
    ".search_reviewscore.responsive_secondrow"
  )
  const img = row.querySelector(".search_capsule img")
  row.querySelector(".steam-better-ui-score-ui").remove()
  deleteAttributes(container, ["style"])
  deleteAttributes(img, ["style"])
  row.classList.remove("steam-better-ui-height")
}


/**
 * Removes the style attribute and the "steam-better-ui-border" class from a given row element.
 * 
 * @param {HTMLElement} row - The row element to remove the style and class from.
 */
const removeStyleUI = (row) => {
  deleteAttributes(row, ["style"])
  row.classList.remove("steam-better-ui-border")
}

// APPLY / REMOVE


/**
 * Applies a better score UI to the search result rows.
 *
 * @param {boolean} msgScoreUi - Indicates whether to apply the score UI or not.
 */
const applyBetterScoreUI = (msgScoreUi) => {
  const searchRows = [
    ...document.querySelectorAll(
      ".search_result_row:not(.steam-better-ui-height)"
    ),
  ]
  searchRows.map((row) => {
    const review = row.querySelector(".search_review_summary")
    if (review && review.hasAttribute("data-tooltip-html")) {
      const reviewStats = review.dataset.tooltipHtml.match(regexNumber)
      if (reviewStats && reviewStats.length) {
        if (msgScoreUi) {
          row.classList.add("steam-better-ui-height")
          prependScoreUI(row, {
            percent: reviewStats[0],
            reviews: reviewStats[1],
          })
        }
      }
    }
  })
}


/**
 * Applies better style UI to the search result rows based on the provided message style.
 * 
 * @param {boolean} msgStyle - The message style to apply.
 */
const applyBetterStyleUI = (msgStyle) => {
  const searchRows = [
    ...document.querySelectorAll(
      ".search_result_row:not(.steam-better-ui-border)"
    ),
  ]
  searchRows.map((row) => {
    const review = row.querySelector(".search_review_summary")
    if (review && review.hasAttribute("data-tooltip-html")) {
      const reviewStats = review.dataset.tooltipHtml.match(regexNumber)
      if (reviewStats && reviewStats.length) {
        if (msgStyle)
          prependStyleUI(row, {
            percent: reviewStats[0],
            reviews: reviewStats[1],
          })
      }
    }
  })
}


/**
 * Removes the better score UI from the search result rows.
 * @param {boolean} msgScoreUi - Flag indicating whether to remove the score UI or not.
 */
const removeBetterScoreUI = (msgScoreUi) => {
  const searchRows = [
    ...document.querySelectorAll(".search_result_row.steam-better-ui-height"),
  ]
  searchRows.map((row) => {
    const review = row.querySelector(".search_review_summary")
    if (review && review.hasAttribute("data-tooltip-html")) {
      if (!msgScoreUi) {
        removeScoreUI(row)
      }
    }
  })
}


/**
 * Removes the better style UI from the search result rows.
 * @param {boolean} msgStyleUi - Indicates whether to remove the style UI or not.
 */
const removeBetterStyleUI = (msgStyleUi) => {
  const searchRows = [
    ...document.querySelectorAll(".search_result_row.steam-better-ui-border"),
  ]
  searchRows.map((row) => {
    const review = row.querySelector(".search_review_summary")
    if (review && review.hasAttribute("data-tooltip-html")) {
      if (!msgStyleUi) {
        removeStyleUI(row)
      }
    }
  })
}

// COLORS UI


/**
 * Applies colors to the UI elements.
 *
 * @param {Object} colors - The colors to be applied.
 */
const applyColorsUI = (colors) => {
  const root = document.documentElement

  if (colors && Object.keys(colors).length > 0) {
    Object.keys(colors).map((colorName) =>
      Object.keys(colors[colorName]).map((colorNum) =>
        root.style.setProperty(
          `--color-${colorName}-${colorNum}`,
          colors[colorName][colorNum].color
        )
      )
    )
  }
}

// Runtime
chrome.runtime.sendMessage({ type: "REQ_SCORE_UI_STATUS" })
chrome.runtime.sendMessage({ type: "REQ_STYLE_UI_STATUS" })
chrome.runtime.sendMessage({ type: "REQ_COLORS_UI_STATUS" })
chrome.runtime.sendMessage({ type: "REQ_COMPLETED_REQUEST_STATUS" })

// onMessage
chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "SCORE_UI_STATUS":
      console.log("SCORE_UI_STATUS")
      if (message.scoreUi) if (!scoreUi) applyBetterScoreUI(message.scoreUi)
      if (!message.scoreUi) if (scoreUi) removeBetterScoreUI(message.scoreUi)

      scoreUi = message.scoreUi
      break
    case "STYLE_UI_STATUS":
      console.log("STYLE_UI_STATUS")
      if (message.styleUi) if (!styleUi) applyBetterStyleUI(message.styleUi)
      if (!message.styleUi) if (styleUi) removeBetterStyleUI(message.styleUi)

      styleUi = message.styleUi
      break

    case "COLORS_UI_STATUS":
      console.log("COLORS_UI_STATUS")
      if (JSON.stringify(colorsUi) !== JSON.stringify(message.colorsUi))
        applyColorsUI(message.colorsUi)
      colorsUi = message.colorsUi
      break

    case "REQUEST_SEARCH_COMPLETED":
      console.log("REQUEST_SEARCH_COMPLETED")
      if (scoreUi) applyBetterScoreUI(scoreUi)
      if (styleUi) applyBetterStyleUI(styleUi)
      break
    // first request is completed when page is not rendered
    // so check if background already has completed request
    case "REQUEST_SEARCH_COMPLETED_STATUS":
      console.log("REQUEST_SEARCH_COMPLETED_STATUS")
      if (scoreUi) applyBetterScoreUI(scoreUi)
      if (styleUi) applyBetterStyleUI(styleUi)
      break
    default:
      break
  }
})
