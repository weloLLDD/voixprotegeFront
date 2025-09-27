import React from "react";
import Header from "../components/Header"; 
import Sidebar from "../components/sidebar";
import Invoice from "../components/Invoice";
import RapportConsultationTable from "../components/report/RapportConsultationTable";

const InvoiceAll = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
    
        <RapportConsultationTable/>
      </main>
    </>
  );
};

export default InvoiceAll;
