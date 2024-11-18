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

// import CategoryPage from './Pages/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      {/* <Navigation /> */}
      <Routes>
        {/* <HomeBanner /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/category/:categoryId" element={<CategoryPage />} /> */}
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/comics/:id" element={<ComicDetailPage />} />
        <Route path="/purchase" element={<Purchase />}></Route>

        <Route path="/login" element={<LoginSignup/>} />
        <Route path="/signup" element={<LoginSignup/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
