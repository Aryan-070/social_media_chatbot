import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create Authentication Context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored authentication token
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ username: "StoredUser" }); // Replace with API call if needed
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
