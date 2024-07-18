import React, { useEffect, useState } from "react";
// import logoSportx from "../assets/logo/Logo-sportx.png";
import AdminIcon from "../assets/logo/admin-svgrepo.svg";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";

function Entry() {
  const [screen, setScreen] = useState(1); // Destructure the state value and setter
  const navigate = useNavigate(); // Add this if you're using React Router v6

  useEffect(() => {
    const handleLogout = async () => {
      const token = await localStorage.getItem("jwtToken");
      if (token && token.length > 1) { // Check if token is not null and has length > 1
        navigate("/dashboard");
      }
    };
    handleLogout();
  }, [navigate]);

  const Display = () => {
    if (screen === 0) { // Use strict equality check
      return null;
    } else if (screen === 1) {
      return <Login />;
    }
  };

  return (
    <div className="w-full">
      <Display />
    </div>
  );
}

export default Entry;
