 // src/components/profils/ProfileScreen.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../Redux/Action/userActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const MainCategories = () => {
  const dispatch = useDispatch();

  // Redux : user connecté
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, error, loading } = userUpdateProfile;

  // Champs formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  // Pré-remplir avec infos actuelles
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  // Soumission formulaire
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas !");
    } else {
      setMessage(null);
      dispatch(updateUserProfile({  name, email, password }));
    }
  };

  return (
    <section className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          {/* Titre et bouton ajouter utilisateur */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">👤{name}  </h2>
            <button
              className="btn btn-success"
              onClick={() => window.location.href = "/adduser"}
            >
              ➕ Ajouter un utilisateur
            </button>
          </div>

          {/* Carte du profil */}
          <div className="card shadow-sm">
            <div className="card-body p-4 text-center">

              {/* Avatar */}
              <div className="mb-4">
                <img
                  src="./images/user.png"
                  alt="Avatar utilisateur"
                  className="rounded-circle shadow-sm"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              </div>

              {/* Messages */}
              {message && <Message variant="danger">{message}</Message>}
              {error && <Message variant="danger">{error}</Message>}
              {success && <Message variant="success">✅ Profil mis à jour</Message>}
              {loading && <Loading />}

              {/* Formulaire */}
              <form onSubmit={submitHandler} className="mt-3 text-start">
                <div className="mb-3">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Mettre à jour
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCategories;



 
   






