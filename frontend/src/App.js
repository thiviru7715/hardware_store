// Main App component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import InventoryTable from "./components/InventoryTable";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#e53935', // Red theme
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="reports" element={<InventoryTable />} />
            {/* Placeholders for other routes */}
            <Route path="*" element={<div style={{ padding: 20 }}>Page Under Construction</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
