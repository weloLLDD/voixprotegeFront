// src/components/cases/CaseList.js
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import io from "socket.io-client";

import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import "./CaseList.css";
import { listAllCases, listMyCases } from "../../Redux/Action/casesActions";

const CaseList = () => {
  const dispatch = useDispatch();

  const userInfo = useMemo(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || {};
  }, []);

  const [recentActions, setRecentActions] = useState([]);

  const caseListMy = useSelector((state) => state.caseListMy || {});
  const caseListAll = useSelector((state) => state.caseListAll || {});

  const cases = useMemo(() => {
    if (userInfo.role === "admin") return caseListAll.cases || [];
    return caseListMy.cases || [];
  }, [userInfo.role, caseListAll.cases, caseListMy.cases]);

  const loading =
    userInfo.role === "admin" ? caseListAll.loading : caseListMy.loading;
  const error =
    userInfo.role === "admin" ? caseListAll.error : caseListMy.error;

  useEffect(() => {
    if (!userInfo?._id) {
      window.location.href = "/login";
    } else {
      if (userInfo.role === "admin") {
        dispatch(listAllCases());
      } else {
        dispatch(listMyCases());
      }
    }
  }, [dispatch, userInfo._id, userInfo.role]);

  // Actions récentes
  useEffect(() => {
    if (Array.isArray(cases) && cases.length > 0) {
      const actions = [];
      cases.forEach((c) => {
        if (Array.isArray(c.historique) && c.historique.length > 0) {
          c.historique.forEach((h) => {
            actions.push({
              caseTitle: c.titre || "Sans titre",
              action: h.action || "Action inconnue",
              user: h.actionPar?.name || "Utilisateur supprimé",
              date: new Date(
                h.creeLe || h.createdAt || c.dateHeure || Date.now()
              ),
            });
          });
        }
      });
      actions.sort((a, b) => b.date - a.date);
      setRecentActions(actions.slice(0, 10));
    } else {
      setRecentActions([]);
    }
  }, [cases]);

  // Socket.IO live update
  useEffect(() => {
    if (!userInfo?._id) return;
    const socket = io("http://localhost:5000");
    socket.emit("joinAgent", userInfo._id);

    socket.on("nouveauCas", (newCase) => {
      setRecentActions((prev) => [
        {
          caseTitle: newCase.titre || "Sans titre",
          action: "Nouveau dossier assigné",
          user: "Système",
          date: new Date(),
        },
        ...prev,
      ]);
      if (userInfo.role === "admin") {
        dispatch(listAllCases());
      } else {
        dispatch(listMyCases());
      }
    });

    return () => socket.disconnect();
  }, [dispatch, userInfo._id, userInfo.role]);

  // Couleurs statuts
  const statusColors = {
    en_attente: "#3b82f6",
    en_cours: "#f97316",
    en_investigation: "#f59e0b",
    en_attente_info: "#8b5cf6",
    transmis_autorite: "#6366f1",
    resolu: "#10b981",
    clos: "#6b7280",
  };

  // Data utils
  const statusData = useMemo(() => {
    if (!Array.isArray(cases)) return [];
    const statusCounts = {};
    cases.forEach((c) => {
      const status = c.statut || "en_attente";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return Object.keys(statusCounts).map((key) => ({
      name: key,
      count: statusCounts[key],
      color: statusColors[key] || "#9ca3af",
    }));
  }, [cases]);

  const violationData = useMemo(() => {
    if (!Array.isArray(cases)) return [];
    const counts = {};
    cases.forEach((c) => {
      const type = c.typeViolation || "Inconnu";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [cases]);
  const violationColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
  ];

  const timelineData = useMemo(() => {
    if (!Array.isArray(cases)) return [];
    const counts = {};
    cases.forEach((c) => {
      const date = new Date(c.dateHeure || Date.now()).toLocaleDateString(
        "fr-FR"
      );
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.keys(counts)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => ({ date, count: counts[date] }));
  }, [cases]);

  const stackedData = useMemo(() => {
    if (!Array.isArray(cases)) return [];
    const map = {};
    cases.forEach((c) => {
      const type = c.typeViolation || "Inconnu";
      const statut = c.statut || "en_attente";
      map[type] = map[type] || {};
      map[type][statut] = (map[type][statut] || 0) + 1;
    });
    return Object.keys(map).map((type) => ({ type, ...map[type] }));
  }, [cases]);

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

  return (
    <section className="content-main container mt-4">
      <div className="content-header d-flex justify-content-between align-items-center mb-4">
        <h2 className="content-title">
          📊 Dashboard {userInfo?.role === "admin" ? "Global" : "Agent"}
        </h2>
        <div className="admin-profile d-flex align-items-center gap-2">
          <i className="fa fa-user-circle fa-2x text-primary"></i>{" "}
          {capitalize(userInfo?.role)}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant={"alert-danger"}>{error}</Message>
      ) : userInfo.role === "citoyen" ? (
        // ---- Vue pour citoyen ----
        <div className="row mb-4">
          <div className="col-md-12 mb-4">
            <div className="card shadow-lg p-3">
              <h5 className="mb-3">📄 Mes dossiers signalés</h5>
              <table className="table table-hover modern-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Violation</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        Aucun dossier trouvé
                      </td>
                    </tr>
                  ) : (
                    cases.slice(0, 10).map((c) => (
                      <tr key={c._id}>
                        <td>{capitalize(c.titre)}</td>
                        <td>{capitalize(c.typeViolation)}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                statusColors[c.statut] || "#9ca3af",
                              color: "#fff",
                            }}
                          >
                            {capitalize(c.statut.replace("_", " "))}
                          </span>
                        </td>
                        <td>
                          {new Date(
                            c.dateHeure || Date.now()
                          ).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // ---- Vue normale (admin / agent) ----
        <>
          {/* STAT CARDS */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card shadow-lg text-center p-3 bg-primary text-white">
                <h3>{cases.length}</h3>
                <p>
                  {userInfo?.role === "admin"
                    ? "Total dossiers"
                    : "Mes dossiers"}
                </p>
              </div>
            </div>
            {statusData.map((s, idx) => (
              <div className="col-md-3 mb-3" key={idx}>
                <div
                  className="card shadow-lg text-center p-3"
                  style={{
                    backgroundColor: s.color,
                    color: "#fff",
                    borderRadius: "15px",
                  }}
                >
                  <h3>{s.count}</h3>
                  <p>{capitalize(s.name.replace("_", " "))}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GRAPHIQUES */}
          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <div className="card shadow-lg p-3">
                <h5 className="mb-3">📊 Répartition par Statut</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {statusData.map((entry, index) => (
                      <Bar
                        key={index}
                        dataKey="count"
                        fill={entry.color}
                        name={entry.name}
                        radius={[5, 5, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-lg p-3">
                <h5 className="mb-3">🥷 Répartition par Type de Violation</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={violationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {violationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            violationColors[index % violationColors.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-12 mb-4">
              <div className="card shadow-lg p-3">
                <h5 className="mb-3">📈 Dossiers par Date</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-12 mb-4">
              <div className="card shadow-lg p-3">
                <h5 className="mb-3">📊 Statuts par Type de Violation</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stackedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(statusColors).map((statut, idx) => (
                      <Bar
                        key={idx}
                        dataKey={statut}
                        stackId="a"
                        fill={statusColors[statut]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DOSSIERS & ACTIONS */}
          <div className="row mb-4">
            <div className="col-md-8 mb-4">
              <div className="card shadow-lg p-3">
                <h5 className="mb-3">📄 Dossiers Récents</h5>
                <table className="table table-hover modern-table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Violation</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          Aucun dossier trouvé
                        </td>
                      </tr>
                    ) : (
                      cases.slice(0, 10).map((c) => (
                        <tr key={c._id}>
                          <td>{capitalize(c.titre)}</td>
                          <td>{capitalize(c.typeViolation)}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  statusColors[c.statut] || "#9ca3af",
                                color: "#fff",
                              }}
                            >
                              {capitalize(c.statut.replace("_", " "))}
                            </span>
                          </td>
                          <td>
                            {new Date(
                              c.dateHeure || Date.now()
                            ).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-lg p-3">
                <h5 className="mb-3">⚡ Actions Récentes</h5>
                <ul className="list-unstyled recent-actions">
                  {recentActions.length === 0 ? (
                    <p className="text-muted">Pas d'actions récentes</p>
                  ) : (
                    recentActions.map((a, idx) => (
                      <li key={idx} className="mb-2">
                        <strong>{a.user}</strong> {a.action}{" "}
                        <em>{capitalize(a.caseTitle)}</em> –{" "}
                        {a.date.toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CaseList;
