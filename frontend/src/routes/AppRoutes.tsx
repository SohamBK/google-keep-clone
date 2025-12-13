import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import Archive from "../pages/Archive";
import Trash from "../pages/Trash";
import RequireAuth from "../components/RequireAuth";
import AppLayout from "../layouts/AppLayout";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Not found route */}
      <Route path="*" element={<NotFound />} />
      {/* Protected routes*/}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/archive"
        element={
          <RequireAuth>
            <AppLayout>
              <Archive />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/trash"
        element={
          <RequireAuth>
            <AppLayout>
              <Trash />
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
