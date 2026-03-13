import PropTypes from 'prop-types';

const LoadingSpinner = ({ fullPage }) => {
  if (fullPage) {
    return (
      <div className='loading-fullpage'>
        <div className='spinner' />
      </div>
    );
  }
  return (
    <div className='loading-container'>
      <div className='spinner' />
    </div>
  );
};

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  fullPage: false,
};

export default LoadingSpinner;
