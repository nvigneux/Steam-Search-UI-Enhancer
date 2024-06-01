/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';

// Icons
import ArrowDown from './icons/IconArrowDown';
import NewIconChevron from './icons/NewIconChevron';

function Picto({ icon, ...props }) {
  switch (icon) {
    case 'arrowDown':
      return <ArrowDown {...props} />;
    case 'newIconChevron':
      return <NewIconChevron {...props} />;
    default:
      return null;
  }
}

export const availablePictos = ['arrowDown', 'newIconChevron'];

Picto.propTypes = {
  icon: PropTypes.oneOf(availablePictos).isRequired,
};

export default Picto;
