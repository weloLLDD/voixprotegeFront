import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, listUser } from "../../Redux/Action/userActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const CreateUser = () => {
  const dispatch = useDispatch();

  // Champs du formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("agent");

  // Redux state pour création utilisateur
  const userCreate = useSelector((state) => state.userCreate || {});
  const { loading, error, success } = userCreate;

  // Redux state pour liste utilisateurs
  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  // Rafraîchir la liste après succès
  useEffect(() => {
    if (success) {
      dispatch(listUser());
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("agent");
    }
  }, [dispatch, success]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createUser({ name, email, password, role }));
  };

  return (
    <div className="container mt-5">
      <h3>Créer un utilisateur</h3>

      {loading && <Loading />}
      {error && <Message variant="alert-danger">{error}</Message>}
      {success && <Message variant="alert-success">Utilisateur créé avec succès !</Message>}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label>Nom complet</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom complet"
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>

        <div className="mb-3">
          <label>Rôle</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="agent">Agent</option>
            <option value="citoyen">citoyen</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Créer l'utilisateur
        </button>
      </form>

      <hr />

      <h4 className="mt-4">Liste des utilisateurs</h4>
      <ul className="list-group">
        {users && users.map((user) => (
          <li key={user._id} className="list-group-item">
            {user.name} - {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateUser;
