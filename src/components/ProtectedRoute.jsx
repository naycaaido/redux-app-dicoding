import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { authedUser } = useSelector((state) => state.auth);
  if (!authedUser) {
    return <Navigate to='/login' replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
