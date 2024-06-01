/* eslint-disable react/jsx-props-no-spreading */
function SVG(props) {
  return (
    <svg viewBox="0 0 14 8" version="1.1" {...props}>
      <g id="Page-1" stroke="none" strokeWidth="1">
        <g id="etats" transform="translate(-685.000000, -656.000000)">
          <g id="ArrowDown" transform="translate(685.000000, 656.000000)">
            <path
              d="M10.7,3.3 L4.7,-2.7 C4.3,-3.1 3.7,-3.1 3.3,-2.7 C2.9,-2.3 2.9,-1.7 3.3,-1.3 L8.6,4 L3.3,9.3 C2.9,9.7 2.9,10.3 3.3,10.7 C3.5,10.9 3.7,11 4,11 C4.3,11 4.5,10.9 4.7,10.7 L10.7,4.7 C11.1,4.3 11.1,3.7 10.7,3.3 L10.7,3.3 Z"
              id="arrowdown"
              transform="translate(7.000000, 4.000000) rotate(-270.000000) translate(-7.000000, -4.000000) "
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default SVG;
