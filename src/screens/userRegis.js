import React from 'react'
import Sidebar from '../components/sidebar';
import Header from '../components/Header'; 
import CreateCategory from '../components/Categories/CreateCategory';

 
const  UserRegis = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <CreateCategory/>
      </main>
    </>
  );
};

export default UserRegis;

