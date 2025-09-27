import React from "react";
import Header from "../components/Header";
import Main from "../components/Home/Main";
import Sidebar from "./../components/sidebar";
import CaseEvolution from "../components/case/CaseEvolution";

const EvolutionScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header/>
        <CaseEvolution/>
      </main>
    </>
  );
};

export default EvolutionScreen;
