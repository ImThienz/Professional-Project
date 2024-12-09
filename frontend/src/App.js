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
import UserProfile from "./Pages/User/Profile";
import ContactPage from "./Pages/User/Contact";
// import OrderHistory from "./Pages/User/UserOrder";
import CartPage from "./Pages/CartPage";
// import CategoryPage from './Pages/CategoryPage';
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ComicAdmin from "./Pages/Admin/ManageComics";
import ManageComics from "./Pages/Admin/ManageComics";
import ComicList from "./Pages/Chapter/ComicList";
import ChaptersPage from "./Pages/Chapter/ChaptersPage";
import ChapterManagement from "./Pages/Admin/ChapterManagement";
import VoucherManager from "./Pages/Admin/VoucherManager";
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
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* <Route path="/order-history" element={<OrderHistory />} /> */}
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/comics" element={<ComicAdmin />} />
        <Route path="/admin/manageComics" element={<ManageComics />} />
        <Route path="/admin/manageChapters" element={<ChapterManagement />} />
        <Route path="/admin/manageVouchers" element={<VoucherManager />} />
        {/* Route hiển thị danh sách ảnh trong chapter */}
        <Route path="/truyen" element={<ComicList />} />
        <Route path="/comics/:id/chapters" element={<ChaptersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
