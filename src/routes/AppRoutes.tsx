import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { menuItems, type MenuItem } from "../menuConfig";
import Loading from "../common/Loading";
import ProtectedRoute from "../ProtectedRoute";
import Registration from "../components/Registration";
import Layout from "../Layout";
import Login from "../components/Login";

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Protected routes with layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {menuItems.map((item: MenuItem) => {
              // If item has children, render children routes only
              if (item.children && item.children.length > 0) {
                return item.children.map((child) => (
                  <Route
                    key={child.to}
                    path={child.to}
                    element={child.element}
                  />
                ));
              }

              // Otherwise, render parent route normally
              return <Route key={item.to} path={item.to} element={item.element} />;
            })}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
