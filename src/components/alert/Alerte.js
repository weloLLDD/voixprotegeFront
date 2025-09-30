// pages/Alertes.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client"; 
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const socket = io("https://voixprotegebdd-mvhx.onrender.com"); // adapter le port selon ton backend

const Alerte = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupérer les alertes depuis le backend
  const fetchAlerts = async () => {
    if (!userInfo) return;
    try {
      setLoading(true);
      const { data } = await axios.get("/api/alerts", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setAlerts(data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  // Marquer une alerte comme lue
  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/alerts/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isRead: true } : a))
      );
    } catch (err) {
      console.error("Erreur marquer lu:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Socket.io – écouter les nouvelles alertes
    if (userInfo) {
      socket.emit("join", userInfo._id); // rejoindre la room de l'utilisateur
      socket.on("nouvelleAlerte", (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev]);
      });
    }

    return () => {
      socket.off("nouvelleAlerte");
    };
  }, [userInfo]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🔔 Alertes</h2>
      {loading && <Loading/>}
      {error && <Message variant="alert-danger">{error}</Message>}

      {alerts.length === 0 && !loading && (
        <p>Aucune alerte pour le moment.</p>
      )}

      <ul className="list-group">
        {alerts.map((alert) => (
          <li
            key={alert._id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              alert.isRead ? "list-group-item-light" : "list-group-item-warning"
            }`}
          >
            <div>
              <strong>{alert.type.toUpperCase()}</strong>: {alert.message}
              {alert.caseId && <span> (Dossier ID: {alert.caseId})</span>}
              <br />
              <small className="text-muted">
                {new Date(alert.createdAt).toLocaleString()}
              </small>
            </div>
            {!alert.isRead && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => markAsRead(alert._id)}
              >
                Marquer lu
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerte;
