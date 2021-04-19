import React from "react"
import PropTypes from "prop-types"

// Style
import style from "./CategoryTitle.module.css"

const CategoryTitle = ({ title, children }) => (
  <div className={style.categoryTitle}>
    <div className={style.categoryTitleHead}>
      <h2 className={style.categoryTitleTitle}>{title}</h2>
      {children}
    </div>
  </div>
)

CategoryTitle.propTypes = {
  title: PropTypes.string.isRequired,
}

export default CategoryTitle
