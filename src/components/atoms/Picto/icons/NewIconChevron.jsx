import React from "react"

const SVG = (props) => (
  <svg width="30px" height="30px" viewBox="0 0 30 30" version="1.1" {...props}>
    <title>Icon / Chevron</title>
    <defs>
      <filter id="filter-1">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.521569 0 0 0 0 0.525490 0 0 0 0 0.560784 0 0 0 1.000000 0"
        />
      </filter>
    </defs>
    <g
      id="Icon-/-Chevron-down"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g filter="url(#filter-1)" id="Group">
        <g transform="translate(5.000000, 5.000000)">
          <polygon id="Path" points="0 0 20 0 20 20 0 20" />
          <path
            d="M4.41074435,6.91074435 C4.72412804,6.59736066 5.22501185,6.58575385 5.55228444,6.87592394 L5.58925565,6.91074435 L10,11.32125 L14.4107443,6.91074435 C14.724128,6.59736066 15.2250119,6.58575385 15.5522844,6.87592394 L15.5892557,6.91074435 C15.9026393,7.22412804 15.9142461,7.72501185 15.6240761,8.05228444 L15.5892557,8.08925565 L10.5892557,13.0892557 C10.275872,13.4026393 9.77498815,13.4142461 9.44771556,13.1240761 L9.41074435,13.0892557 L4.41074435,8.08925565 C4.08530744,7.76381874 4.08530744,7.23618126 4.41074435,6.91074435 Z"
            id="Path"
            fill="#85868F"
          />
        </g>
      </g>
    </g>
  </svg>
)

export default SVG
