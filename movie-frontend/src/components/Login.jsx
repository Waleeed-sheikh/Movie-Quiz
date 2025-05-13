import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../sockets";
import { jwtDecode } from "jwt-decode"; 
import "../Style-files/loginPageStyle.css";
import show from "../icons/visible.png";
import user from "../icons/user.png";
import key from "../icons/key.png";
import hide from "../icons/hide.png";
function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    setSuccessMessage("");

    if (!userName || !password) {
      setError("Username & Password are Required!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users/login", {
        userName,
        password,
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
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

   useEffect(() => {
        const token = localStorage.getItem("TimerToken");
        
        if (token) {
            try {
                const decoded = jwtDecode(token); 
                if (decoded.exp * 1000 < Date.now()) {
                    
                    localStorage.removeItem("TimerToken");
                    localStorage.removeItem("Username");
                    navigate("/login");
                }
            } catch (error) {
                
                localStorage.removeItem("TimerToken");
                localStorage.removeItem("Username");
                navigate("/login");
            }
        }
    }, [navigate]);

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!userName || !password) {
      setError("Username & Password are Required!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/users/signup", {
        userName,
        password,
      });

      setSuccessMessage(
        "You are signed up! You can now login with the same credentials."
      );
      setIsSignUp(false);
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-container">
      <div className="hero">
        <div className="logo">
          <h1>I love movies, Do you?</h1>
        </div>
      </div>

      <div className="auth-card">
        <div className="card-header">
          <h2>{isSignUp ? "Register Me!" : "Wanna Play!"}</h2>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div className="input-group">
            <label>So Who's playing?</label>
            <div className="input-field">
              <span className="icon">
                <img className="icons" src={user} />
              </span>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="The name's... Bond?"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-field">
              <span className="icon">
                <img className="icons" style={{ padding: "1px" }} src={key} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Say the magic word..."
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <img className="icons" src={hide} />
                ) : (
                  <img className="icons" src={show} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert error">
              <span>⚠️</span> {error}
            </div>
          )}

          {successMessage && (
            <div className="alert success">
              <span>🎉</span> {successMessage}
            </div>
          )}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? (
              <span className="button-processing">
                <span className="spinner"></span>
                Doing some heavy processing...
              </span>
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Let's Play!"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p className="footer2">
            {isSignUp ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-btn"
              style={{ textDecoration: "underline" }}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>

      <div className="footer">
        <p></p>
      </div>
    </div>
  );
}

export default Login;
