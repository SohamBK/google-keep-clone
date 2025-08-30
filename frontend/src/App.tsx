import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { selectAuth, setAuthTokens } from "./store/auth/authSlice";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFound from "./pages/NotFound";
import NotesPage from "./pages/notes/NotesPage";
import Layout from "./components/common/Layout";
import type { ReactElement, ReactNode } from "react";

const App: React.FC = () => {
  const { accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedUser) {
      dispatch(
        setAuthTokens({
          user: JSON.parse(storedUser),
          accessToken: storedAccessToken,
        })
      );
    }
  }, [dispatch]);

  const PrivateRoute = ({ children }: { children: ReactElement }) => {
    return accessToken ? children : <LoginPage />;
  };

  return (
    <div className="App font-sans">
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <NotesPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
