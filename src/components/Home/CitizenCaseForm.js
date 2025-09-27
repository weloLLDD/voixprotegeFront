import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Alert, Card, ProgressBar } from "react-bootstrap";
import { createCase } from "../../Redux/Action/casesActions";

const CitizenCaseForm = () => {
  const dispatch = useDispatch();

  // Local state
  const [titre, setTitre] = useState("");
  const [typeViolation, setTypeViolation] = useState("");
  const [detailViolation, setDetailViolation] = useState("");
  const [description, setDescription] = useState("");
  const [piecesJointes, setPiecesJointes] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);

  // Audio vocal
  const [audioFile, setAudioFile] = useState(null); // fichier uploadé
  const [audioBlob, setAudioBlob] = useState(null); // enregistrement direct
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Nouveaux champs
  const [anonyme, setAnonyme] = useState(false);
  const [nomDeclarant, setNomDeclarant] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [personnes, setPersonnes] = useState([]);

  // Redux state
  const caseCreate = useSelector((state) => state.caseCreate);
  const { loading, success, error } = caseCreate;

  // Reset form si succès
  useEffect(() => {
    if (success) {
      setTitre("");
      setTypeViolation("");
      setDetailViolation("");
      setDescription("");
      setPiecesJointes([]);
      setPreviewFiles([]);
      setAudioFile(null);
      setAudioBlob(null);
      setAnonyme(false);
      setNomDeclarant("");
      setDateHeure("");
      setLongitude("");
      setLatitude("");
      setPersonnes([]);
    }
  }, [success]);

  // Gestion fichiers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPiecesJointes(files);

    const previews = files.map((file) => {
      if (file.type.includes("image")) return URL.createObjectURL(file);
      if (file.type.includes("pdf")) return "pdf";
      if (file.type.includes("video")) return "video";
      return null;
    });
    setPreviewFiles(previews);
  };

  // Gestion personnes
  const addPerson = () => setPersonnes([...personnes, { nom: "", role: "" }]);
  const handlePersonChange = (idx, field, value) => {
    const newPersons = [...personnes];
    newPersons[idx][field] = value;
    setPersonnes(newPersons);
  };

  // Enregistrement vocal direct
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", titre);

    if (typeViolation === "autre") {
      formData.append("typeViolation", "autre");
      formData.append("detailViolation", detailViolation || "Autre");
    } else {
      formData.append("typeViolation", typeViolation);
    }

    formData.append("description", description);
    formData.append("envoyePar", "Citoyen");
    formData.append("anonyme", anonyme);
    if (!anonyme && nomDeclarant) formData.append("nomDeclarant", nomDeclarant);

    if (dateHeure) formData.append("dateHeure", dateHeure);
    if (longitude && latitude) {
      formData.append("localisation[coordonnees][]", longitude);
      formData.append("localisation[coordonnees][]", latitude);
    }

    personnes.forEach((p, idx) => {
      formData.append(`personnes[${idx}][nom]`, p.nom);
      formData.append(`personnes[${idx}][role]`, p.role);
    });

    piecesJointes.forEach((file) => formData.append("piecesJointes", file));
    if (audioFile) formData.append("audioVocal", audioFile);
    if (audioBlob) formData.append("audioVocal", audioBlob, "enregistrement.webm");

    dispatch(createCase(formData));
  };

  return (
    <div className="d-flex justify-content-center align-items-center my-5">
      <Card className="shadow-lg p-4" style={{ maxWidth: "700px", width: "100%", borderRadius: "20px", border: "none" }}>
        <h3 className="mb-4 text-center fw-bold">📄 Soumettre un dossier</h3>

        {success && <Alert variant="success">✅ Dossier envoyé avec succès !</Alert>}
        {error && <Alert variant="danger">❌ {error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Titre */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Titre du dossier</Form.Label>
            <Form.Control type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required placeholder="Ex: Dossier pollution" />
          </Form.Group>

          {/* Type de violation */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Type de violation</Form.Label>
            <Form.Select value={typeViolation} onChange={(e) => setTypeViolation(e.target.value)} required>
              <option value="">-- Sélectionnez un type --</option>
              <option value="arrestation_arbitraire">Arrestation arbitraire</option>
              <option value="torture">Torture</option>
              <option value="disparition">Disparition</option>
              <option value="autre">Autre</option>
            </Form.Select>
          </Form.Group>

          {typeViolation === "autre" && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Préciser le type</Form.Label>
              <Form.Control type="text" value={detailViolation} onChange={(e) => setDetailViolation(e.target.value)} placeholder="Indiquez le type de violation" required />
            </Form.Group>
          )}

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre dossier en détail..." />
          </Form.Group>

          {/* Envoyé par Citoyen */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Envoyé par</Form.Label>
            <Form.Control type="text" value="Citoyen" readOnly />
          </Form.Group>

          {/* Anonyme */}
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Soumettre anonymement" checked={anonyme} onChange={(e) => setAnonyme(e.target.checked)} />
          </Form.Group>

          {!anonyme && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nom du déclarant</Form.Label>
              <Form.Control type="text" value={nomDeclarant} onChange={(e) => setNomDeclarant(e.target.value)} placeholder="Votre nom complet" />
            </Form.Group>
          )}

          {/* Date et heure */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Date et heure de l'incident</Form.Label>
            <Form.Control type="datetime-local" value={dateHeure} onChange={(e) => setDateHeure(e.target.value)} />
          </Form.Group>

          {/* Localisation */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Localisation (coordonnées)</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control type="number" step="any" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
              <Form.Control type="number" step="any" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            </div>
          </Form.Group>

          {/* Personnes impliquées */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Personnes impliquées</Form.Label>
            {personnes.map((p, idx) => (
              <div key={idx} className="d-flex gap-2 mb-2">
                <Form.Control type="text" placeholder="Nom" value={p.nom} onChange={(e) => handlePersonChange(idx, "nom", e.target.value)} />
                <Form.Select value={p.role} onChange={(e) => handlePersonChange(idx, "role", e.target.value)}>
                  <option value="">-- Rôle --</option>
                  <option value="victime">Victime</option>
                  <option value="temoin">Témoin</option>
                  <option value="suspect">Suspect</option>
                </Form.Select>
              </div>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={addPerson}>➕ Ajouter une personne</Button>
          </Form.Group>

          {/* Pièces jointes */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Pièces jointes (images, PDF, vidéos)</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} accept="image/*,application/pdf,video/*" />
          </Form.Group>

          {/* Prévisualisation */}
          {previewFiles.length > 0 && (
            <div className="d-flex flex-wrap mb-3">
              {previewFiles.map((file, idx) => (
                <div key={idx} className="d-flex flex-column align-items-center me-3 mb-3">
                  {file === "pdf" ? <span style={{ fontSize: "2.5rem", color: "#E53935" }}>📄</span> :
                   file === "video" ? <span style={{ fontSize: "2.5rem", color: "#1E88E5" }}>🎬</span> :
                   <img src={file} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12, boxShadow: "0px 2px 6px rgba(0,0,0,0.2)" }} />}
                </div>
              ))}
            </div>
          )}

          {/* Enregistrement vocal */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Enregistrement vocal</Form.Label>
            <div className="d-flex gap-2 mb-2">
              {!recording ? (
                <Button variant="secondary" onClick={startRecording}>🎤 Commencer</Button>
              ) : (
                <Button variant="danger" onClick={stopRecording}>⏹️ Arrêter</Button>
              )}
            </div>
            {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
            <Form.Label className="fw-bold mt-2">Ou uploader un fichier audio existant</Form.Label>
            <Form.Control type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
          </Form.Group>

          {/* Progress bar */}
          {loading && <ProgressBar animated now={70} className="mb-3" />}

          {/* Submit */}
          <Button type="submit" variant="primary" className="w-100 py-2 fw-bold" style={{ borderRadius: "12px" }} disabled={loading}>
            {loading ? "⏳ Envoi en cours..." : "📤 Envoyer le dossier"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CitizenCaseForm;
