import PropTypes from 'prop-types'; // Import PropTypes
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouteProfile = ({ token }) => {
  return token ? <Outlet /> : <Navigate to="/Verification" />;
};

PrivateRouteProfile.propTypes = {
    token: PropTypes.bool.isRequired, // Ensure token is a required boolean
};

export default PrivateRouteProfile;
