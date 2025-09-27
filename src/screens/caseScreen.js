import React from "react";
import Header from "../components/Header"; 
import Sidebar from "./../components/sidebar";
import CitizenCaseForm from "../components/Home/CitizenCaseForm";

const CaseScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header/>
        <CitizenCaseForm />
      </main>
    </>
  );
};

export default CaseScreen;
