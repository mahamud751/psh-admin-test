import React, { useContext } from "react";
import { Navigate, useLocation, useOutlet } from "react-router-dom";
import { AuthContext } from "../../contexts/UserProvider";
import Navbar from "../../components/Common/Navbar/Navbar";

import Footer from "../../components/Common/Navbar/Footer";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const outlet = useOutlet();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/signup" />;
  }
  return (
    <div>
      <Navbar />

      {outlet}
      <Footer />
    </div>
  );
};

export default PrivateRoute;
