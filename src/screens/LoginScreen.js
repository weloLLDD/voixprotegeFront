import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Action/userActions";
import Loading from "../components/LoadingError/Loading";
import Message from "../components/LoadingError/Error";
import Toast from "../components/LoadingError/Toast";
import { useNavigate } from "react-router-dom"; 
import { FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

const Login = () => {
  window.scrollTo(0, 0);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  // Validation simple email ou téléphone
  useEffect(() => {
    if (!emailOrPhone) {
      setInputError("");
      return;
    }
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneRegex = /^[0-9]{8,15}$/;

    if (emailRegex.test(emailOrPhone)) setInputError("");
    else if (phoneRegex.test(emailOrPhone)) setInputError("");
    else setInputError("Veuillez entrer un email ou numéro valide");
  }, [emailOrPhone]);

  // Redirection après login
  useEffect(() => {
    if (userInfo) {
      // Redirection selon rôle
      if (userInfo.role === "admin") navigate("/HomeScreen");
      else navigate("/HomeScreen");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (inputError) return;
    dispatch(login(emailOrPhone, password));
  };

  return (
    <>
      <Toast />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #334155, #1e293b)",
        }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "400px",
            width: "100%",
            borderRadius: "20px",
            backgroundColor: "#f8fafc",
          }}
        >
          {error && <Message variant="alert-danger">{error}</Message>}
          {loading && <Loading />}
          {inputError && <Message variant="alert-danger">{inputError}</Message>}

          <h3 className="text-center mb-4" style={{ color: "#334155" }}>
            🔑 Connexion
          </h3>

          <form onSubmit={submitHandler}>
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                {emailOrPhone && /^[0-9]+$/.test(emailOrPhone) ? <FaPhone /> : <FaEnvelope />}
              </span>
              <input
                className="form-control"
                placeholder="Email ou Numéro"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                <FaLock />
              </span>
              <input
                className="form-control"
                placeholder="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: "12px", background: "#334155", border: "none" }}
              >
                Se connecter
              </button>
            </div>
          </form>

          <p className="text-center mt-3 mb-0" style={{ fontSize: "14px" }}>
            Pas encore de compte ?{" "}
            <a href="/register" style={{ color: "#334155", fontWeight: "bold" }}>
              Créez-en un
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
