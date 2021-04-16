const regexNumber = /(\d{0,3},)?(\d{3},)?(\d+)/g
const setAttributes = (el, attrs) => {
  Object.keys(attrs).forEach((key) => {
    if (key && attrs[key]) el.setAttribute(key, attrs[key])
  })
}
/**
 * Snowing
 */
const body = document.getElementsByTagName("body")
const snowflakesContainer = document.createElement("div")
snowflakesContainer.className = "snowflakes"
snowflakesContainer.setAttribute("aria-hidden", "true")

const snowflake = document.createElement("div")
snowflake.className = "snowflake"
snowflake.innerHTML = "❆"
for (let i = 0; i < 12; i += 1) {
  snowflakesContainer.appendChild(snowflake.cloneNode(true))
}

/**
 * Steam rating UI
 */

const applyBetterScoreUi = (row, { percent, reviews }) => {
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
  setAttributes(div, {
    style:
      "font-size:10px;position:absolute;width:max-content;left:21%;bottom:-10px;",
  })

  div.innerHTML += `${percent}% - ${reviews} reviews`
  container.appendChild(div)
}

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

const applyBetterStyle = (row, { percent, reviews }) => {
  setAttributes(row, {
    style: `border-right: 6px solid ${reviewColor(
      Number(percent),
      Number(reviews.replace(/,/g, ""))
    )}`,
  })
}

const applyRatingUi = () => {
  const searchRows = [
    ...document.querySelectorAll(".search_result_row:not(.steam-better-ui)"),
  ]
  searchRows.map((row) => {
    row.classList.add("steam-better-ui")
    const review = row.querySelector(".search_review_summary")
    if (review && review.hasAttribute("data-tooltip-html")) {
      const reviewStats = review.dataset.tooltipHtml.match(regexNumber)

      if (reviewStats && reviewStats.length) {
        if (true)
          applyBetterScoreUi(row, {
            percent: reviewStats[0],
            reviews: reviewStats[1],
          })

        if (true)
          applyBetterStyle(row, {
            percent: reviewStats[0],
            reviews: reviewStats[1],
          })
      }
    }
  })
}

// const applyBetterStyle = (rows) => {}

// Const init
let snowing = false

// Runtime
chrome.runtime.sendMessage({ type: "REQ_SNOW_STATUS" })
chrome.runtime.sendMessage({ type: "REQ_COMPLETED_REQUEST" })

// onMessage
chrome.runtime.onMessage.addListener((message) => {
  console.log(message)
  switch (message.type) {
    case "SNOW_STATUS":
      if (message.snowing) {
        if (!snowing) {
          body[0]?.prepend(snowflakesContainer)
        }
      }

      if (!message.snowing) {
        snowflakesContainer.parentNode?.removeChild(snowflakesContainer)
      }
      snowing = message.snowing
      break
    case "REQUEST_SEARCH_COMPLETED":
      applyRatingUi()
      break
    default:
      break
  }
})
