import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/ProductList";
import ProductEdit from "../pages/ProductEdit";
import CategoryList from "../pages/CategoryList";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminRegister from "../pages/AdminRegister";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id/edit" element={<ProductEdit />} />
        <Route path="/product/new" element={<ProductEdit />} />
        <Route path="/categories" element={<CategoryList />} />
      </Route>
      
      {/* Admin Only Routes */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        {/* You can keep any routes that should truly be admin-only here */}
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
