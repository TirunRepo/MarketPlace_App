import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "../common/Loading";
import ProtectedRoute from "../ProtectedRoute";
import Registration from "../components/Registration";
import Layout from "../Layout";
import AddInventory from "../components/inventory/AddInventory";
import Promotion from "../components/promotions/Promotion";
import AddMarkup from "../components/markup/AddMarkup";

const Login = lazy(() => import("../components/Login"));
const Dashboard = lazy(() => import("../components/dashboard/Dashboard"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<AddInventory/>} />
            <Route path="/promotions" element={<Promotion/>} />
            <Route path="/markup" element={<AddMarkup/>} />
            <Route path="/reports" element={<div>Reports Page</div>} />
            <Route path="/admin" element={<div>Admin Page</div>} />
            <Route path="/role-management" element={<div>Role Mgmt</div>} />
          </Route>
        </Route>

        <Route path="/registration" element={<Registration />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
