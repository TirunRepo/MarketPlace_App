import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { menuItems } from "../menuConfig";
import Loading from "../common/Loading";
import ProtectedRoute from "../ProtectedRoute";
import Registration from "../components/Registration";
import Layout from "../Layout";
import Login from "../components/Login";

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Protected with layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {menuItems.map((item) => {
              debugger
              return (
                <Route
                  key={item.to}
                  path={item.to}
                  element={item.element}
                />
              )
            })}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
