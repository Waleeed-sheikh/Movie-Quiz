import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../sockets";
import "./style.css"
function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("TimerToken");
        if (token) {
           
            navigate("/Room");
        }
    }, [navigate]);
    
    useEffect(() => {
        const token = localStorage.getItem("TimerToken");
        if (token) {
          socket.auth = { token };
          socket.connect();
        }
      }, []);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        if (!userName || !password) {
            setError("Username & Password are Required!");
            setLoading(false);
            return;
        }
    
        try {
            const res = await axios.post("http://localhost:5000/users/login", {
                userName,
                password
            });
    
   
            const token = res.data.token;
            localStorage.setItem("TimerToken", token);
            localStorage.setItem("Username", res.data.userName);
    
            
            socket.auth = { token };     
            socket.connect();            
    
            navigate("/Room");
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div id="container">
            <form id="login" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;