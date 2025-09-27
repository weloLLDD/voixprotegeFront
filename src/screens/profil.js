import React from "react";
import Header from "../components/Header"; 
import Sidebar from "../components/sidebar"; 
import ProfileScreen from "../components/profils/ProfileScreen";

const Profil = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header /> 
       <ProfileScreen />
      
      </main>
    </>
  );
};

export default Profil;
