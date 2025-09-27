import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import { deleteDocument, listDocument, consultDocument } from "../../Redux/Action/DocumentAction";

const MainProducts = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tous");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [expandedDocId, setExpandedDocId] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const documentList = useSelector((state) => state.documentList);
  const { loading, error, documents, page: currentPage, pages } = documentList;

  const documentDelete = useSelector((state) => state.documentDelete); 
  const { error: errorDelete, success: successDelete } = documentDelete;

  useEffect(() => {
    dispatch(listDocument(page, pageSize, selectedType, selectedYear, searchTerm));
  }, [dispatch, page, pageSize, selectedType, selectedYear, searchTerm, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      dispatch(deleteDocument(id));
    }
  };

  const openModal = (doc) => {
    setSelectedPDF(doc.fileUrl);
    dispatch(consultDocument(doc._id));
    const modal = new window.bootstrap.Modal(document.getElementById("pdfModal"));
    modal.show();
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, pages));

  // Types et années pour filtres
  const types = ["Tous"];
  const years = [];
  if (documents && documents.length > 0) {
    documents.forEach((doc) => {
      if (!types.includes(doc.type)) types.push(doc.type);
      const y = new Date(doc.createdAt).getFullYear();
      if (!years.includes(y)) years.push(y);
    });
    years.sort((a,b) => b - a);
  }

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

  return (
    <section className="content-main container mt-4">
      <div className="content-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h2 className="content-title mb-2 mb-md-0">📂 Gestion des Documents</h2>
        <Link to="/addproduct" className="btn btn-primary">➕ Ajouter</Link>
      </div>

      {/* Recherche et filtres */}
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-4">
          <input
            type="text"
            placeholder="🔍 Rechercher un document..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <div className="col-6 col-md-4">
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
          >
            {types.map((type, idx) => (
              <option key={idx} value={type}>{capitalize(type)}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-4">
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
          >
            <option value="">Toutes les années</option>
            {years.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {errorDelete && <Message variant="alert-danger">{errorDelete}</Message>}
      {loading ? <Loading /> : error ? <Message variant="alert-danger">{error}</Message> : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {documents.length === 0 ? (
              <Message variant="alert-info">Aucun document trouvé</Message>
            ) : documents.map((doc) => (
              <div key={doc._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{capitalize(doc.title)}</h5>
                    <p className="card-text text-truncate">{capitalize(doc.description)}</p>
                    <p className="card-text mb-1">📄 <strong>{capitalize(doc.type)}</strong></p>
                    <p className="card-text text-muted mb-2">
                      📅 Ajouté le : {new Date(doc.createdAt).toLocaleString("fr-FR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                    </p>

                    <div className="mt-auto d-flex flex-wrap gap-2">
                      <button className="btn btn-sm btn-outline-primary flex-grow-1" onClick={() => openModal(doc)}>Aperçu</button>
                      <button className="btn btn-sm btn-outline-success flex-grow-1" onClick={() => {
                        const message = `Voici un document : ${capitalize(doc.title)}%0A📎 Lien : ${doc.fileUrl}`;
                        window.open(`https://wa.me/?text=${message}`, "_blank");
                      }}>🟢 WhatsApp</button>
                      <button className="btn btn-sm btn-outline-info flex-grow-1" onClick={() => {
                        if (navigator.share) navigator.share({ title: capitalize(doc.title), text: `Voici le document "${capitalize(doc.title)}"`, url: doc.fileUrl }).catch(() => {});
                        else { navigator.clipboard.writeText(doc.fileUrl); alert("📋 Lien copié !"); }
                      }}>📤 Partager</button>
                      <button className="btn btn-sm btn-outline-dark flex-grow-1" onClick={() => {
                        const subject = encodeURIComponent(`Partage du document : ${capitalize(doc.title)}`);
                        const body = encodeURIComponent(`Bonjour,\n\nJe vous partage ce document : ${capitalize(doc.title)}\n📎 Lien : ${doc.fileUrl}`);
                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                      }}>✉️ Email</button>

                      {/* Modifier/Supprimer seulement si admin ou propriétaire */}
                      {(userInfo?.isAdmin || userInfo?._id === doc.owner?._id) && (
                        <>
                          <Link to={`/product/${doc._id}/edit`} className="btn btn-sm btn-outline-warning flex-grow-1">✏️ Modifier</Link>
                          <button className="btn btn-sm btn-outline-danger flex-grow-1" onClick={() => deleteHandler(doc._id)}>🗑️ Supprimer</button>
                        </>
                      )}

                      <button className="btn btn-sm btn-outline-info flex-grow-1" onClick={() => setExpandedDocId(expandedDocId === doc._id ? null : doc._id)}>
                        {expandedDocId === doc._id ? "🔽 Masquer" : "📜 Historique"}
                      </button>
                    </div>

                    {/* Historique */}
                    {expandedDocId === doc._id && (
                      <div className="mt-3">
                        {doc.history?.length > 0 ? (
                          <div className="d-flex flex-column gap-2">
                            {doc.history.map((h, index) => (
                              <div key={index} className="card p-2 shadow-sm">
                                <strong>{capitalize(h.action)}</strong>
                                <small className="d-block text-muted">{h.user?.name || "Utilisateur supprimé"} – {new Date(h.date).toLocaleString("fr-FR")}</small>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-muted">Pas d'historique</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <nav className="d-flex justify-content-center my-4">
              <ul className="pagination flex-wrap">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={handlePrevPage}>Précédent</button>
                </li>
                {[...Array(pages).keys()].map((x) => (
                  <li key={x+1} className={`page-item ${currentPage === x+1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(x+1)}>{x+1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === pages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={handleNextPage}>Suivant</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Modal PDF */}
      <div className="modal fade" id="pdfModal" tabIndex="-1" aria-labelledby="pdfModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">📄 Aperçu du PDF</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div className="modal-body" style={{ height: "80vh" }}>
              {selectedPDF ? (
                <iframe
                  src={`https://docs.google.com/gview?url=${selectedPDF}&embedded=true`}
                  style={{ width: "100%", height: "100%" }}
                  title="Aperçu PDF"
                />
              ) : <p className="text-muted">Aucun PDF sélectionné</p>}
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <a href={selectedPDF} download className="btn btn-success">⬇️ Télécharger</a>
              <button className="btn btn-secondary" onClick={() => { const win = window.open(selectedPDF, "_blank"); win.focus(); win.print(); }}>🖨️ Imprimer</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainProducts;
