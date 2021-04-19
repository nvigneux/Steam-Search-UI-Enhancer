import React from "react"
import PropTypes from "prop-types"

// Utils
import cn from "../../../utils/cn"

// Style
import style from "./ToggleSwitch.module.css"

const ToggleSwitch = ({
  name,
  onChange,
  onBlur,
  id,
  className,
  toggled,
  disabled,
  toggledLabel,
  untoggledLabel,
}) => (
  <label
    className={cn([
      style.switch,
      className,
      disabled && style.disabled,
      !toggledLabel || !untoggledLabel ? style.short : "",
    ])}
    htmlFor={id}
  >
    <input
      disabled={disabled}
      id={id}
      name={name}
      onChange={() => {
        if (!disabled) onChange()
      }}
      onBlur={onBlur}
      checked={toggled}
      type="checkbox"
    />
    <span className={style.sliderRound} />
    {toggledLabel && untoggledLabel ? (
      <>
        <span className={cn([style.label, style.yesLabel])}>
          {toggledLabel}
        </span>
        <span className={cn([style.label, style.noLabel])}>
          {untoggledLabel}
        </span>
      </>
    ) : null}
  </label>
)

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
  toggledLabel: PropTypes.string,
  untoggledLabel: PropTypes.string,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

ToggleSwitch.defaultProps = {
  onBlur: () => {},
  className: null,
  disabled: false,
  toggledLabel: "",
  untoggledLabel: "",
}

export default ToggleSwitch
