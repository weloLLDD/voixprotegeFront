import React, { useEffect, useState } from "react";
import { Card, Badge } from "react-bootstrap";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const AllCases = ({ isAdmin }) => {
  const [cases, setCases] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchCases = async () => {
      if (!userInfo?.token) return;

      try {
        const url = isAdmin
          ? "https://voixbdd.onrender.com/api/case/all"
          : "https://voixbdd.onrender.com/api/case/mesdossiers";
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCases(data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchCases();
  }, [isAdmin, userInfo]);

  // Préparer les données pour le graphique
  const typeData = Object.entries(
    cases.reduce((acc, c) => {
      acc[c.typeViolation] = (acc[c.typeViolation] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, value]) => ({ name: type, value }));

  const statusData = Object.entries(
    cases.reduce((acc, c) => {
      acc[c.statut] = (acc[c.statut] || 0) + 1;
      return acc;
    }, {})
  ).map(([statut, value]) => ({ name: statut, value }));

  const getBadgeVariant = (type) => {
    switch (type) {
      case "arrestation_arbitraire": return "danger";
      case "torture": return "warning";
      case "disparition": return "secondary";
      case "autre": return "info";
      default: return "dark";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isAdmin ? "Tous les dossiers" : "Mes dossiers"}</h2>

      {/* Graphiques */}
      {cases.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <Card className="p-3 shadow-sm">
              <h5>Répartition par type de violation</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="col-md-6 mb-3">
            <Card className="p-3 shadow-sm">
              <h5>Répartition par statut</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#36A2EB" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Liste des dossiers */}
      {cases.length === 0 && <p>Aucun dossier trouvé.</p>}
      <div className="row">
        {cases.map((c) => (
          <div key={c._id} className="col-md-4 mb-3">
            <Card className="p-3 shadow-sm rounded">
              <h5>
                {c.titre} <Badge bg={getBadgeVariant(c.typeViolation)}>{c.typeViolation}</Badge>
              </h5>
              <p>
                Statut :{" "}
                <strong
                  style={{
                    color:
                      c.statut === "resolu"
                        ? "green"
                        : c.statut === "en_cours"
                        ? "orange"
                        : "gray",
                  }}
                >
                  {c.statut}
                </strong>
              </p>
              {c.assigneA && <p>Agent : {c.assigneA.name}</p>}

              {/* Timeline */}
              {c.evolution?.length > 0 && (
                <div className="timeline mt-2">
                  {c.evolution.slice().reverse().map((ev, idx) => (
                    <div key={idx} className="timeline-item mb-2 p-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <strong>{ev.etape}</strong>
                        <Badge bg="secondary">
                          {new Date(ev.creeLe).toLocaleString("fr-FR")}
                        </Badge>
                      </div>
                      <p className="mb-0">{ev.commentaire}</p>
                      <small className="text-muted">
                        Par : {ev.creePar?.name || "Utilisateur inconnu"}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCases;
