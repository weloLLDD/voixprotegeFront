 import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { createDocument } from "../../Redux/Action/DocumentAction";
import { toast } from "react-toastify";
import { DOCUMENTS_CREATE_RESET } from "../../Redux/constants/DocumentConstant";
import Message from "../LoadingError/Error";
import Toast from "../LoadingError/Toast";
import Loading from "../LoadingError/Loading";

const AddProductMain = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Autre");
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();

  const documentCreate = useSelector((state) => state.documentCreate);
  const { loading, error, success, document } = documentCreate;

  useEffect(() => {
    if (success) {
      toast.success("Document ajouté avec succès ✅");
      dispatch({ type: DOCUMENTS_CREATE_RESET });
      setTitle("");
      setDescription("");
      setType("Autre");
      setFile(null);
    }
  }, [dispatch, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }
    dispatch(createDocument(title, description, type, file));
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Aller aux documents
            </Link>
            <h2 className="content-title">Ajouter un Document</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Publier
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}

                  <div className="mb-4">
                    <label className="form-label">Titre du document</label>
                    <input
                      type="text"
                      placeholder="Tapez ici"
                      className="form-control"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Description</label>
                    <textarea
                      placeholder="Tapez ici"
                      className="form-control"
                      rows="5"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Type de document</label>
                    <select
                      className="form-control"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Autre">Autre</option>
                      <option value="Contrat">Contrat</option>
                      <option value="CV">CV</option>
                      <option value="Attestation">Attestation</option>
                      <option value="Offre">Offre</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Fichier PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="form-control"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                    />
                    {file && (
                      <small className="text-success">{file.name} sélectionné</small>
                    )}
                  </div>

                  {document && document.fileUrl && (
                    <div className="mt-3">
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                      >
                        Voir le document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;








