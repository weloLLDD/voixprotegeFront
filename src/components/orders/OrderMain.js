 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const navigate = useNavigate();
  const [myCases, setMyCases] = useState([]);
  const [newCases, setNewCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [toasts, setToasts] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch dossiers
  useEffect(() => {
    const fetchCases = async () => {
      if (!userInfo?._id) return;

      try {
        let url =
          userInfo.role === "citoyen"
            ? "http://localhost:5000/api/case/mesdossiers"
            : userInfo.role === "admin"
            ? "http://localhost:5000/api/case/all"
            : "http://localhost:5000/api/case/mescas";

        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const lastSeenIds =
          JSON.parse(localStorage.getItem("lastSeenCases")) || [];
        const newAssigned = data.filter((c) => !lastSeenIds.includes(c._id));
        setNewCases(newAssigned);

        localStorage.setItem(
          "lastSeenCases",
          JSON.stringify(data.map((c) => c._id))
        );
        setMyCases(data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(
          "Erreur lors du chargement des dossiers : " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    fetchCases();
  }, [userInfo]);

  // Socket.IO – écoute pour agents/admin et citoyens
  useEffect(() => {
    if (!userInfo?._id) return;

    if (userInfo.role !== "citoyen") {
      // Agents / Admin
      socket.emit("joinAgent", userInfo._id);
      socket.on("nouveauCas", (newCase) => {
        setMyCases((prev) => [newCase, ...prev]);
        setNewCases((prev) => [newCase, ...prev]);
      });

      return () => socket.off("nouveauCas");
    } else {
      // Citoyen – écoute évolutions de dossier
      socket.emit("joinCitizen", userInfo._id);
      socket.on("nouvelleEvolution", ({ caseId, evolution }) => {
        setMyCases((prev) =>
          prev.map((c) =>
            c._id === caseId
              ? { ...c, evolution: [...c.evolution, evolution] }
              : c
          )
        );
        setToasts((prev) => [
          ...prev,
          {
            id: Date.now(),
            message: `Nouvelle étape dans votre dossier : ${evolution.etape}`,
          },
        ]);
      });

      return () => socket.off("nouvelleEvolution");
    }
  }, [userInfo]);

  // Mettre à jour le statut
  const updateStatus = async (caseId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/case/${caseId}/statut`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setMyCases((prev) =>
        prev.map((c) => (c._id === caseId ? { ...c, statut: newStatus } : c))
      );
      setNewCases((prev) => prev.filter((c) => c._id !== caseId));
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        "Erreur lors de la mise à jour du statut : " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Clic sur Suivi
  const handleSuiviClick = async (c) => {
    if (c.statut !== "en_cours" && c.statut !== "resolu") {
      await updateStatus(c._id, "en_cours");
    }
    navigate(`/dossier/${c._id}/suivi`);
  };

  const openModal = (file) => {
    setModalFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalFile(null);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        Bonjour {userInfo?.name} 👋
        {newCases.length > 0 && userInfo.role !== "citoyen" && (
          <span className="badge bg-info ms-2">
            {newCases.length} nouveau(x)
          </span>
        )}
      </h2>

      <div className="row">
        {myCases.length === 0 && <p>Vous n’avez aucun dossier.</p>}

        {myCases.map((c) => (
          <div key={c._id} className="col-md-4 mb-3">
            <div className="card shadow-sm p-3" style={{ borderRadius: "15px" }}>
              <h5>{c.titre}</h5>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {c.description || "Pas de description"}
              </p>
              <p>
                Type: <strong>{c.typeViolation}</strong>
              </p>
              <p>
                Statut:{" "}
                <span
                  style={{
                    color:
                      c.statut === "resolu"
                        ? "green"
                        : c.statut === "en_cours"
                        ? "orange"
                        : "gray",
                    fontWeight: "bold",
                  }}
                >
                  {c.statut}
                </span>
              </p>

              {/* 👇 Correction : afficher declarant + agent côté admin/agent */}
              {userInfo.role !== "citoyen" && (
                <>
                  {c.declarant && (
                    <p>
                      Citoyen: <strong>{c.declarant.name}</strong>
                    </p>
                  )}
                  {c.assigneA && (
                    <p>
                      Agent: <strong>{c.assigneA.name}</strong>
                    </p>
                  )}
                </>
              )}

              {c.piecesJointes?.length > 0 && (
                <div className="d-flex flex-wrap mb-2">
                  {c.piecesJointes.map((file, idx) => (
                    <div
                      key={idx}
                      style={{ marginRight: "8px", cursor: "pointer" }}
                      onClick={() => openModal(file)}
                    >
                      {file.typeFichier === "image" ? (
                        <img
                          src={file.url}
                          alt="preview"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : file.typeFichier === "pdf" ? (
                        <span style={{ fontSize: "2rem", color: "#E53935" }}>
                          📄
                        </span>
                      ) : file.typeFichier === "video" ? (
                        <span style={{ fontSize: "2rem", color: "#1E88E5" }}>
                          🎬
                        </span>
                      ) : (
                        <span>📎</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Boutons */}
              <div className="d-flex flex-wrap mb-2">
                {userInfo.role !== "citoyen" && c.statut !== "resolu" && (
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => updateStatus(c._id, "resolu")}
                  >
                    Marquer comme Résolu
                  </Button>
                )}

                {c.statut !== "resolu" && userInfo.role !== "citoyen" ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mb-2"
                    onClick={() => handleSuiviClick(c)}
                  >
                    Suivi
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mb-2"
                    onClick={() => navigate(`/dossier/${c._id}/suivi`)}
                  >
                    Détails
                  </Button>
                )}
              </div>

              {/* Timeline moderne pour citoyens */}
              {userInfo.role === "citoyen" && c.evolution?.length > 0 && (
                <div
                  className="mt-3 p-3"
                  style={{ background: "#f0f4f8", borderRadius: "12px" }}
                >
                  <h6 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>
                    Évolution du dossier :
                    <span className="badge bg-primary ms-2">
                      {c.evolution.length} étapes
                    </span>
                  </h6>

                  <div style={{ position: "relative", paddingLeft: "25px" }}>
                    {c.evolution.map((e, idx) => (
                      <div
                        key={idx}
                        style={{ position: "relative", marginBottom: "20px" }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background:
                              idx === c.evolution.length - 1
                                ? "#0d6efd"
                                : "#6c757d",
                            position: "absolute",
                            left: 0,
                            top: "5px",
                          }}
                        ></div>
                        {idx < c.evolution.length - 1 && (
                          <div
                            style={{
                              width: "2px",
                              height: "100%",
                              background: "#dee2e6",
                              position: "absolute",
                              left: "5px",
                              top: "15px",
                            }}
                          ></div>
                        )}
                        <div
                          style={{
                            marginLeft: "25px",
                            fontSize: "0.87rem",
                            color: "#495057",
                          }}
                        >
                          <strong>
                            {new Date(e.creeLe).toLocaleString("fr-FR")} :
                          </strong>{" "}
                          {e.etape} {e.commentaire && `- ${e.commentaire}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-2" style={{ fontSize: "0.8rem", color: "#888" }}>
                {new Date(c.dateHeure).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Pièce jointe</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {modalFile?.typeFichier === "image" && (
            <img src={modalFile.url} alt="image" style={{ maxWidth: "100%" }} />
          )}
          {modalFile?.typeFichier === "pdf" && (
            <iframe
              src={modalFile.url}
              style={{ width: "100%", height: "500px" }}
            />
          )}
          {modalFile?.typeFichier === "video" && (
            <video src={modalFile.url} controls style={{ width: "100%" }} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toasts */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg="info"
            onClose={() =>
              setToasts((prev) => prev.filter((x) => x.id !== t.id))
            }
            delay={5000}
            autohide
          >
            <Toast.Body style={{ color: "#fff" }}>{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default Dashboard;
