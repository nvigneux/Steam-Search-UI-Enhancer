import PropTypes from 'prop-types';

// Style
import style from './CategoryTitle.module.css';

function CategoryTitle({ title, children }) {
  return (
    <div className={style.categoryTitle}>
      <div className={style.categoryTitleHead}>
        <h2 className={style.categoryTitleTitle}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

CategoryTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CategoryTitle;
