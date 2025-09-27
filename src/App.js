import React, { useEffect } from "react";
import "./App.css";
import "./responsive.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";

import ProductScreen from "./screens/productScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import AddProduct from "./screens/AddProduct";
import Login from "./screens/LoginScreen";
import UsersScreen from "./screens/UsersScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import NotFound from "./screens/NotFound";
import PrivanteRoute from "./screens/privanteRoute";
import { useDispatch, useSelector } from "react-redux";
import { listProduct } from "./Redux/Action/ProductAction";
import { listOrders } from "./Redux/Action/OrderAction";
import DepenseScreen from "./screens/depenseScreen";
import DepenseEditScreen from "./screens/DepenseEditScreen";
import AddDepense from "./screens/AddDepense";
import InvoiceAll from "./screens/InvoiceAll";
import ArchivesAll from "./screens/ArchivesAll";
import InsertArchive from "./screens/InsertArchive";
import DashboardALL from "./screens/DashboardALL";
import InvoiceAlls from "./screens/InvoiceAlls";
import Profil from "./screens/profil";
import UserRegis from "./screens/userRegis";
import CaseScreen from "./screens/caseScreen";
import EvolutionScreen from "./screens/EvolutionScreen";
import DashboardCitoyen from "./screens/DashboardCitoyen";
import Register from "./screens/register";
import AlerteScreen from "./screens/AlerteScreen";

function App() {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listProduct());
      dispatch(listOrders());
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <Router>
        <Routes>
          <Route exact element={<PrivanteRoute />}>
            <Route path="/HomeScreen" element={<HomeScreen />} />
            <Route path="/caseScreen" element={<CaseScreen />} />
            <Route path="/products" element={<ProductScreen />} />

            <Route path="/depense" element={<DepenseScreen />} />

            <Route path="/category" element={<CategoriesScreen />} />
            <Route path="/orders" element={<OrderScreen />} />
            <Route path="/order/:id" element={<OrderDetailScreen />} />

            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/adddepenses" element={<AddDepense />} />

            <Route path="/users" element={<UsersScreen />} />

            <Route path="/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="/depense/:id/edit" element={<DepenseEditScreen />} />
            <Route path="/Invoice" element={<InvoiceAll />} />
            <Route path="/Invoices" element={<InvoiceAlls />} />

            <Route path="/ArchivesAll" element={<ArchivesAll />} />
            <Route path="/InsertArchive" element={<InsertArchive />} />
            <Route path="/DashboardALL" element={<DashboardALL />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/adduser" element={<UserRegis />} />
            <Route path="/evolution" element={<EvolutionScreen/>} />
            <Route path="/dossier/:id/suivi" element={<EvolutionScreen />} />
             <Route path="/DashCitoyen" element={<DashboardCitoyen />} />
             <Route path="/alertes" element={<AlerteScreen/>} />

             



            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} exact />
           <Route path="/register" element={<Register />} exact />
        </Routes>
      </Router>
    </>
  );
}

export default App;
