 import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Alert, Button, Form, Card, Badge } from "react-bootstrap";
import { addCaseEvolution, getCaseEvolution } from "../../Redux/Action/casesActions";

const CaseEvolution = () => {
  const { id } = useParams(); // id du dossier
  const dispatch = useDispatch();
  const caseEvolutionState = useSelector((state) => state.caseEvolution);
  const { loading, error, case: caseData } = caseEvolutionState;

  const [etape, setEtape] = useState("");
  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    if (id) dispatch(getCaseEvolution(id));
  }, [dispatch, id]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (etape.trim() === "") return alert("L'étape est obligatoire");
    dispatch(addCaseEvolution(id, { etape, commentaire }));
    setEtape("");
    setCommentaire("");
  };

  // Définir couleur du badge selon typeViolation
  const getBadgeVariant = (type) => {
    switch (type) {
      case "arrestation_arbitraire":
        return "danger";
      case "torture":
        return "warning";
      case "disparition":
        return "secondary";
      case "autre":
        return "info";
      default:
        return "dark";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Suivi du dossier</h2>

      {loading && <p>Chargement...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      {caseData && (
        <div className="mb-3">
          <h5>
            {caseData.titre}{" "}
            <Badge bg={getBadgeVariant(caseData.typeViolation)}>
              {caseData.typeViolation}
            </Badge>
          </h5>
          <p>
            Statut :{" "}
            <strong
              style={{
                color:
                  caseData.statut === "resolu"
                    ? "green"
                    : caseData.statut === "en_cours"
                    ? "orange"
                    : "gray",
              }}
            >
              {caseData.statut}
            </strong>
          </p>
        </div>
      )}

      {!loading && caseData?.evolution?.length === 0 && (
        <Alert variant="info">Aucune évolution pour ce dossier.</Alert>
      )}

      {/* Timeline des évolutions */}
      <div className="timeline mb-4">
        {caseData?.evolution
          ?.slice()
          .reverse()
          .map((ev, idx) => (
            <div
              key={idx}
              className="timeline-item mb-3 p-3 shadow-sm rounded"
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className="mb-0">{ev.etape}</h5>
                <Badge bg="secondary">
                  {new Date(ev.creeLe).toLocaleString("fr-FR")}
                </Badge>
              </div>
              <p className="mb-1">{ev.commentaire}</p>
              <small className="text-muted">
                Par: {ev.creePar?.name || "Utilisateur inconnu"}
              </small>
            </div>
          ))}
      </div>

      {/* Formulaire ajout évolution (caché si résolu) */}
      {caseData?.statut !== "resolu" && (
        <Card className="p-3 shadow-sm rounded">
          <h5>Ajouter une nouvelle étape</h5>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-2">
              <Form.Label>Étape</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Début enquête"
                value={etape}
                onChange={(e) => setEtape(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Commentaire</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Commentaire (facultatif)"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2">
              Ajouter l'étape
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default CaseEvolution;
