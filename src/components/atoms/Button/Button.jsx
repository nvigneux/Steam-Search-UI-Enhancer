/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

// Utils & misc
import cn from '../../../utils/cn';
import Loader from './icons/Loader';

// Style
import style from './Button.module.css';

const Button = React.forwardRef(
  (
    {
      children,
      className,
      type,
      onClick,
      color,
      size,
      outline,
      isLoading,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn([
        style.btn,
        className,
        style[color],
        style[size],
        outline ? style.outline : null,
      ])}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader className={style.loader} /> : null}
      {children}
    </button>
  ),
);

Button.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'grey',
    'transparent',
    'transparentPrimary',
    'white',
  ]).isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['xs', 's', 'm', 'l']),
  className: PropTypes.string,
  outline: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  className: null,
  size: 'm',
  onClick: () => {},
  outline: false,
  isLoading: false,
  disabled: false,
};

export default Button;
