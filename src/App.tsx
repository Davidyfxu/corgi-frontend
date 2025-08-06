import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Layout, Menu, Button, theme } from "antd";
import { Toaster } from "react-hot-toast";
import {
  DashboardOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

// Components
import Dashboard from "./components/Dashboard";
import FraudTester from "./components/FraudTester";
import DataManagement from "./components/DataManagement";
import ABTesting from "./components/ABTesting";

const { Header, Sider, Content } = Layout;

// Separate component for the app content to use hooks
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/fraud-tester",
      icon: <SecurityScanOutlined />,
      label: "Fraud Tester",
    },
    {
      key: "/ab-testing",
      icon: <ExperimentOutlined />,
      label: "A/B Testing",
    },
    {
      key: "/data-management",
      icon: <DatabaseOutlined />,
      label: "Data Management",
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        style={{ background: "white" }}
        collapsed={collapsed}
        className="shadow-md min-h-screen"
      >
        <div className="flex items-center justify-center h-16 border-b">
          <span
            className={`font-bold text-lg ${collapsed ? "text-lg" : "text-xl"}`}
          >
            {collapsed ? "🐕" : "🐕 Corgi"}
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-r-0"
          onClick={({ key }) => {
            navigate(key);
          }}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-between px-4 bg-white shadow-sm"
          style={{ background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-16 h-16"
          />
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Fraud Detection System</span>
          </div>
        </Header>
        <Content className="bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fraud-tester" element={<FraudTester />} />
            <Route path="/ab-testing" element={<ABTesting />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </Router>
  );
}

export default App;
