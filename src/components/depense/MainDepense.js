import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import { deleteDocument, listDocument } from "../../Redux/Action/DocumentAction";

const MainDepense = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tous");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [expandedDocId, setExpandedDocId] = useState(null);

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

  const openModal = (pdfUrl) => {
    setSelectedPDF(pdfUrl);
    const modal = new window.bootstrap.Modal(
      document.getElementById("pdfModal")
    );
    modal.show();
  };

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, pages));

  return (
    <section className="content-main container mt-4">
      <div className="content-header d-flex justify-content-between align-items-center mb-3">
       
        <h2 className="content-title mb-0">📜 Historique</h2>
        <Link to="/addproduct" className="btn btn-primary">➕ Ajouter</Link>
      </div>

      {/* 🔍 Filtres */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            placeholder="🔍 Rechercher un document..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
          >
            <option value="Tous">Tous</option>
            {documents.map(doc => doc.type).filter((v,i,a)=>a.indexOf(v)===i).map((type, idx) => (
              <option key={idx} value={type}>{capitalize(type)}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
          >
            <option value="">Toutes les années</option>
            {documents.map(doc => new Date(doc.createdAt).getFullYear())
                      .filter((v,i,a)=>a.indexOf(v)===i)
                      .sort((a,b)=>b-a)
                      .map((year, idx) => (
                        <option key={idx} value={year}>{year}</option>
                      ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Tous les utilisateurs</option>
            {documents.flatMap(d=>d.history.map(h=>h.user?.name||"Utilisateur supprimé"))
                      .filter((v,i,a)=>a.indexOf(v)===i)
                      .map((user, idx) => (
                        <option key={idx} value={user}>{user}</option>
                      ))}
          </select>
        </div>
      </div>

      {errorDelete && <Message variant="alert-danger">{errorDelete}</Message>}
      {loading ? <Loading /> : error ? <Message variant="alert-danger">{error}</Message> : (
        <>
          {documents.length === 0 ? (
            <Message variant="alert-info">Aucun document trouvé</Message>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Document</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Date d'ajout</th>
                    <th>Actions</th>
                    <th>Historique</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc._id} className={doc.isDeleted ? "text-muted" : ""}>
                      <td>{capitalize(doc.title)}</td>
                      <td>{capitalize(doc.description)}</td>
                      <td>{capitalize(doc.type)}</td>
                      <td>{new Date(doc.createdAt).toLocaleString("fr-FR")}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary mb-1" onClick={() => openModal(doc.fileUrl)}>Aperçu</button>
                        <button className="btn btn-sm btn-outline-warning mb-1" onClick={() => deleteHandler(doc._id)}>Supprimer</button>
                        <button className="btn btn-sm btn-outline-info mb-1" onClick={() => setExpandedDocId(expandedDocId === doc._id ? null : doc._id)}>
                          {expandedDocId === doc._id ? "🔽 Masquer" : "📜 Historique"}
                        </button>
                      </td>
                      <td>
                        {expandedDocId === doc._id ? (
                          doc.history && doc.history.length > 0 ? (
                            <div className="timeline">
                              {doc.history
                                .filter(h => !selectedUser || (h.user?.name||"Utilisateur supprimé") === selectedUser)
                                .sort((a,b)=>new Date(a.date) - new Date(b.date))
                                .map((h, idx) => {
                                  let color;
                                  switch (h.action.toLowerCase()) {
                                    case "upload": color="#1d4ed8"; break;
                                    case "update": color="#f97316"; break;
                                    case "delete": color="#dc2626"; break;
                                    case "consult": color="#16a34a"; break;
                                    default: color="#6b7280";
                                  }
                                  return (
                                    <div key={idx} className="timeline-item">
                                      <div className="timeline-dot" style={{ backgroundColor: color }}></div>
                                      <div className="timeline-content">
                                        <strong style={{ color }}>{capitalize(h.action)}</strong>
                                        <div className="text-muted">{h.user?.name||"Utilisateur supprimé"} – {new Date(h.date).toLocaleString("fr-FR")}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : <span className="text-muted">Pas d'historique</span>
                        ) : <span className="text-muted">Cliquez sur Historique</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <nav className="d-flex justify-content-center my-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage===1 ? "disabled":""}`}>
                  <button className="page-link" onClick={handlePrevPage}>Précédent</button>
                </li>
                {[...Array(pages).keys()].map(x => (
                  <li key={x+1} className={`page-item ${currentPage===x+1?"active":""}`}>
                    <button className="page-link" onClick={()=>setPage(x+1)}>{x+1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage===pages ? "disabled":""}`}>
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
                <iframe src={`https://docs.google.com/gview?url=${selectedPDF}&embedded=true`} style={{ width: "100%", height: "100%" }} title="Aperçu PDF" />
              ) : <p className="text-muted">Aucun PDF sélectionné</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline CSS */}
      <style>{`
        .timeline {
          position: relative;
          margin-left: 15px;
          padding-left: 20px;
          border-left: 2px solid #334155;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 15px;
        }
        .timeline-dot {
          position: absolute;
          left: -10px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px #334155;
        }
        .timeline-content {
          padding-left: 10px;
        }
      `}</style>
    </section>
  );
};

export default MainDepense;

 
