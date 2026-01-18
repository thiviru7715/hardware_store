// Main App component
import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import InventoryTable from "./components/InventoryTable";
import AuthPage from "./pages/AuthPage";
import { usersApi } from "./localStorageApi";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = usersApi.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    usersApi.logout();
    setUser(null);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#e53935', // Red theme
        },
      }}
    >
      <HashRouter>
        <Routes>
          {!user ? (
            // Not logged in - show auth page
            <>
              <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            // Logged in - show main app
            <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<InventoryTable />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
