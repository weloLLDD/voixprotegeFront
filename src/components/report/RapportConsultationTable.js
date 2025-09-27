import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { getConsultationReport } from "../../Redux/Action/reportConsultation";

const RapportConsultationTable = () => {
  const dispatch = useDispatch();
  const consultationReport = useSelector((state) => state.consultationReport);
  const { loading, error, report } = consultationReport;

  useEffect(() => {
    dispatch(getConsultationReport());
  }, [dispatch]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
  <table className="table table-bordered">
  <thead>
    <tr>
      <th>Archive</th>
      <th>Consultations</th>
      <th>Dernier consultant</th>
    </tr>
  </thead>
  <tbody>
    {report.map((item) => (
      <tr key={item.id}>
        <td>{item.titre}</td>
        <td>{item.consultations}</td>
        <td>{item.dernierConsultant}</td>
      </tr>
    ))}
  </tbody>
</table>

  );
};

export default RapportConsultationTable;
