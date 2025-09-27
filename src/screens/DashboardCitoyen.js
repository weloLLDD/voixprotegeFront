import React from "react";
import Header from "../components/Header";
import Main from "../components/Home/Main";
import Sidebar from "./../components/sidebar";
import AllCases from "../components/case/AllCases";

const DashboardCitoyen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header/>
        <AllCases/>
      </main>
    </>
  );
};

export default DashboardCitoyen;
