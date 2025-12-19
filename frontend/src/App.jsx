import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import Wellness from "./pages/Wellness";
import Acharyas from "./pages/Acharyas";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import OjasGurukul from "./pages/OjasGurukul";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/ojas-gurukul" element={<OjasGurukul />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/acharyas" element={<Acharyas />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </Layout>
  );
}

export default App;
