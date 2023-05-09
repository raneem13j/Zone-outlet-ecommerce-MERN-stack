import React from "react";
import "./auth.css";
import { HeaderNavbar, MenuBar } from "../../component/Header/HeaderNavbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../component/Header/footer/footer";

function Auth() {
  const [menubar, setMenuBar] = useState(false);

  const [zih, setZih] = useState(false);

  function activateZih() {
    setZih(true);
  }

  function deactivateZih() {
    setZih(false);
  }
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        "https://zoneoutlet-ckb5.onrender.com/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, address, phonenumber }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("Id", data.user);
      if (data.role === "User") {
        navigate("/");
      }
      console.log("Registration successful");
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  //   login
  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        "https://zoneoutlet-ckb5.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message);
      }
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("Id", data.user);
      sessionStorage.setItem("role", data.role);
      // if (data.role === "User") {
      window.location.href = "/";
      // }
      console.log("Login successful");
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <>
      <HeaderNavbar setMenuBar={setMenuBar} menubar={menubar} />
      <MenuBar menubar={menubar} />

      <div className="J-popup-wrapper">
        <div className="svg-head">
          <div
            className={zih ? "svg-wrapper-1 svg-wrapper-12" : "svg-wrapper-1"}
          >
            <svg height="250" width="400">
              <polygon
                points="160,10 360,120 160,220"
                stroke="#0b496aa3"
                fill="#0b496aa3"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div
            className={zih ? "svg-wrapper-1 svg-wrapper-12" : "svg-wrapper-1"}
          >
            <svg height="300" width="400">
              <polygon
                points="160,10 360,120 160,220"
                stroke="#0b496aa3"
                fill="#0b496aa3"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
        <div className="all-wrapper">
          <div className="all-wrapper-child">
            <div className="ask-login jiji">
              <h1>Have an account?</h1>
              <button onClick={deactivateZih}>Login</button>
            </div>
            <div className="ask-signup jiji">
              <h1>Don't have an account?</h1>
              <button onClick={activateZih}>Register</button>
            </div>
          </div>
          <div className="main-f-wrapper">
            <div className={zih ? "J-forms-wrapper-zih" : "J-forms-wrapper"}>
              <div
                className={
                  zih
                    ? "left-right-wrapper-zih left-right-wrapper"
                    : "left-right-wrapper"
                }
              >
                <form onSubmit={handleLogin}>
                  <div className="login-label">
                    <label className="label-login">
                      Username:
                      <br />
                      <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="login-label">
                    <label className="label-login">
                      Password:
                      <br />
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="login-button">
                    {error && (
                      <p className="error-message"> Invalid Credentials</p>
                    )}
                    <button type="submit">Log In</button>
                  </div>
                </form>

                <form onSubmit={handleSubmit} className="register-container">
                  <div className="username">
                    <label className="label-auth">Username:</label> <br />
                    <input
                      autoComplete="off"
                      className="register-input"
                      type="text"
                      id="username"
                      placeholder="John Doe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="password">
                    <label className="label-auth">Password:</label>
                    <br />
                    <input
                      autoComplete="off"
                      className="register-input"
                      type="password"
                      id="password"
                      placeholder="******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="address">
                    <label className="label-auth">Address:</label>
                    <br />
                    <input
                      autoComplete="off"
                      className="register-input"
                      type="text"
                      id="address"
                      value={address}
                      placeholder="beirut dt aazariye block 3"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="phone-number">
                    <label className="label-auth">Phone Number:</label>
                    <br />
                    <input
                      autoComplete="off"
                      className="register-input"
                      type="text"
                      id="phone-number"
                      placeholder="+961 3 111 222"
                      value={phonenumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {error && <p className="error-message"> {error}</p>}
                  <button className="submit-button" type="submit">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Auth;
