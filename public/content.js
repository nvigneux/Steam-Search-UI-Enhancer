/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
const regexNumber = /(\d{0,3},)?(\d{3},)?(\d+)/g

/**
 *
 * @param {node} el
 * @param {object} attrs
 */
const setAttributes = (el, attrs) => {
  Object.keys(attrs).forEach((key) => {
    if (key && attrs[key]) el.setAttribute(key, attrs[key])
  })
}

/**
 *
 * @param {node} el
 * @param {array} attrs
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

/**
 *
 * @param {number} percent
 * @param {number} reviews
 */
const reviewColor = (percent, reviews) => {
  if (percent <= 100 && percent >= 95) return "var(--color-positive-1)"
  if (percent <= 95 && percent >= 85) return "var(--color-positive-2)"
  if (percent <= 85 && percent >= 80) return "var(--color-positive-3)"
  if (percent <= 79 && percent >= 70) return "var(--color-positive-4)"
  if (percent <= 69 && percent >= 40) return "var(--color-mixed-1)"
  if (percent <= 39 && percent >= 20) return "var(--color-negative-4)"
  if (percent <= 19 && percent >= 0 && reviews >= 500000)
    return "var(--color-negative-3"
  if (percent <= 19 && percent >= 0 && reviews <= 500000 && reviews >= 50000)
    return "var(--color-negative-2"
  if (percent <= 19 && percent >= 0 && reviews <= 50000 && reviews >= 1)
    return "var(--color-negative-1"
}

/**
 *
 * @param {node} row
 * @param {{percent: string, reviews: string}} stats
 */
const betterScoreUi = (row, { percent, reviews }) => {
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
 *
 * @param {node} row
 * @param {{percent: string, reviews: string}} stats
 */
const betterStyle = (row, { percent, reviews }) => {
  row.classList.add("steam-better-ui-border")
  setAttributes(row, {
    style: `border-color: ${reviewColor(
      Number(percent),
      Number(reviews.replace(/,/g, ""))
    )}`,
  })
}

/**
 *
 * @param {node} row
 */
const removeScoreUi = (row) => {
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
 *
 * @param {node} row
 */
const removeStyle = (row) => {
  deleteAttributes(row, ["style"])
  row.classList.remove("steam-better-ui-border")
}

/**
 *
 */
const applyBetterScoreUi = (msgScoreUi) => {
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
          betterScoreUi(row, {
            percent: reviewStats[0],
            reviews: reviewStats[1],
          })
        }
      }
    }
  })
}

/**
 *
 */
const applyBetterStyle = (msgStyle) => {
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
          betterStyle(row, {
            percent: reviewStats[0],
            reviews: reviewStats[1],
          })
      }
    }
  })
}

/**
 *
 */
const removeBetterScoreUi = (msgScoreUi) => {
  const searchRows = [
    ...document.querySelectorAll(".search_result_row.steam-better-ui-height"),
  ]
  searchRows.map((row) => {
    const review = row.querySelector(".search_review_summary")
    if (review && review.hasAttribute("data-tooltip-html")) {
      if (!msgScoreUi) {
        removeScoreUi(row)
      }
    }
  })
}

/**
 *
 */
const removeBetterStyleUi = (msgStyleUi) => {
  const searchRows = [
    ...document.querySelectorAll(".search_result_row.steam-better-ui-border"),
  ]
  searchRows.map((row) => {
    const review = row.querySelector(".search_review_summary")
    if (review && review.hasAttribute("data-tooltip-html")) {
      if (!msgStyleUi) {
        removeStyle(row)
      }
    }
  })
}

// Runtime
chrome.runtime.sendMessage({ type: "REQ_SCORE_UI_STATUS" })
chrome.runtime.sendMessage({ type: "REQ_COMPLETED_REQUEST_STATUS" })

// onMessage
chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "SCORE_UI_STATUS":
      if (message.scoreUi) {
        // if message.scoreUi is false and scoreUi is false
        // if scoreUi is true doesnt need to add to dom because is already active
        if (!scoreUi) {
          // add in dom
          applyBetterScoreUi(message.scoreUi)
        }
      }
      if (!message.scoreUi) {
        // remove in dom
        if (scoreUi) {
          removeBetterScoreUi(message.scoreUi)
        }
      }

      scoreUi = message.scoreUi
      break
    case "REQUEST_SEARCH_COMPLETED":
      // if (scoreUi) applyRatingUi()
      break
    // first request is completed when page is not rendered
    // so check if background already has completed request
    case "REQUEST_SEARCH_COMPLETED_STATUS":
      // if (message.status) applyRatingUi()
      break
    default:
      break
  }
})
