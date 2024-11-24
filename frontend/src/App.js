import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Index";
import Header from "./Components/Header";
import ComicDetailPage from "./Pages/DetailPage";
import Favorites from "./Pages/Favorites";
import Purchase from "./Pages/Purchase";
import { useState } from "react";
import LoginSignup from "./Components/Header/LoginSignup";
import CartPage from "./Pages/CartPage";
// import CategoryPage from './Pages/CategoryPage';
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ComicAdmin from "./Pages/Admin/ManageComics";
import ManageComics from "./Pages/Admin/ManageComics";

function App() {
  return (
    <BrowserRouter>
      <Header />
      {/* <Navigation /> */}
      <Routes>
        {/* <HomeBanner /> */}
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* <Route path="/category/:categoryId" element={<CategoryPage />} /> */}
        <Route path="/comics/:id" element={<ComicDetailPage />} />
        <Route path="/purchase" element={<Purchase />}></Route>

        <Route path="/login" element={<LoginSignup />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/comics" element={<ComicAdmin />} />
        <Route path="/admin/manageComics" element={<ManageComics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
