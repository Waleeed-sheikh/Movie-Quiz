import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("TimerToken");

    if (!token) {
        
        return <Navigate to="/" replace />;
    }

    try {
   
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (isExpired) {
           
            localStorage.removeItem("TimerToken");
            localStorage.removeItem("Username");
            return <Navigate to="/" replace />;
        }

      
        return children;
    } catch (error) {
     
        localStorage.removeItem("TimerToken");
        localStorage.removeItem("Username");
        return <Navigate to="/" replace />;
    }
}

export default ProtectedRoute;