import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../Redux/Action/userActions"; 
import Loading from "../components/LoadingError/Loading";
import Message from "../components/LoadingError/Error";
import Toast from "../components/LoadingError/Toast";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";

const Register = () => {
  window.scrollTo(0, 0);

  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [inputError, setInputError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  // Redirection après inscription ou si déjà connecté
  useEffect(() => {
    if (userInfo) navigate("/orders"); // page par défaut pour citoyen
  }, [userInfo, navigate]);

  // Validation email ou téléphone en temps réel
  useEffect(() => {
    if (!emailOrPhone) {
      setInputError("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{8,15}$/;

    if (emailRegex.test(emailOrPhone)) setInputError("");
    else if (phoneRegex.test(emailOrPhone)) setInputError("");
    else setInputError("Veuillez entrer un email ou numéro valide");
  }, [emailOrPhone]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
    } else if (inputError) {
      setMessage(inputError);
    } else {
      // ⚡ Ici, on déclenche l'action register
      // le rôle citoyen sera automatiquement attribué côté backend
      dispatch(register(name, emailOrPhone, password));
    }
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
          {message && <Message variant="alert-danger">{message}</Message>}
          {error && <Message variant="alert-danger">{error}</Message>}
          {loading && <Loading />}

          <h3 className="text-center mb-4" style={{ color: "#334155" }}>
            📝 Enregistrement Citoyen
          </h3>

          <form onSubmit={submitHandler}>
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white"><FaUser /></span>
              <input
                className="form-control"
                placeholder="Nom complet"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                {emailOrPhone && /^[0-9]+$/.test(emailOrPhone) ? <FaPhone /> : <FaEnvelope />}
              </span>
              <input
                className="form-control"
                placeholder="Email ou Numéro de téléphone"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 input-group">
              <span className="input-group-text bg-white"><FaLock /></span>
              <input
                className="form-control"
                placeholder="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 input-group">
              <span className="input-group-text bg-white"><FaLock /></span>
              <input
                className="form-control"
                placeholder="Confirmer mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: "12px", background: "#334155", border: "none" }}
              >
                S'enregistrer
              </button>
            </div>
          </form>

          <p className="text-center mt-3 mb-0" style={{ fontSize: "14px" }}>
            Vous avez déjà un compte ?{" "}
            <a href="/login" style={{ color: "#334155", fontWeight: "bold" }}>
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
