/* eslint-disable react/void-dom-elements-no-children */
import React from "react"
import PropTypes from "prop-types"

// Style
import style from "./ColorField.module.css"

const ColorField = ({ name, value, onChange, label }) => (
  <div className={style.colorfield}>
    <label className={style.colorfieldInputLabel} htmlFor={name}>
      <input
        className={style.colorfieldInputColor}
        type="color"
        id={name}
        name={name}
        value={value}
        onChange={({ target: { value: color } }) => onChange(color, name)}
      />
      {label}
    </label>
  </div>
)

ColorField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
}

ColorField.defaultProps = {
  value: "",
  onChange: () => {},
}

export default ColorField
