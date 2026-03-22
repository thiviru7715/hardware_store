// Main App component
import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import InventoryTable from "./components/InventoryTable";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import SalaryPage from "./pages/SalaryPage";
import { usersApi } from "./localStorageApi";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App mounted");
    // Check if user is already logged in
    const currentUser = usersApi.getCurrentUser();
    console.log("Current user from storage:", currentUser);
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
          colorPrimary: '#ef4444', // Premium Red (Rose-600)
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgBase: '#ffffff',
          colorTextBase: '#1f2937',
        },
        components: {
          Button: {
            borderRadius: 10,
            controlHeight: 40,
            fontWeight: 600,
          },
          Card: {
            borderRadius: 16,
          },
          Input: {
            borderRadius: 10,
            controlHeight: 44,
          },
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
              <Route path="salaries" element={<SalaryPage />} />
              <Route path="settings" element={<SettingsPage user={user} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
