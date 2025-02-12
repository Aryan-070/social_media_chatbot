import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import PropTypes from "prop-types";
import Login from "./Login";
import Chatbot from "./Chatbot";
import { AuthContext, AuthProvider } from "./AuthContext";
import Register from "./Register"; 
// ✅ PrivateRoute using Context
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

// ✅ PropTypes Validation
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chatbot />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
