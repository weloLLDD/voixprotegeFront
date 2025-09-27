import React from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header"; 
import Alerte from "../components/alert/Alerte";

const AlerteScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <Alerte/>
      
      </main>
    </>
  );
};

export default AlerteScreen;
 