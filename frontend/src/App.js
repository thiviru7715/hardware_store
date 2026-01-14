// Main App component
import { Layout, Typography } from "antd";
import InventoryTable from "./components/InventoryTable";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout>
      <Header>
        <Title style={{ color: "white" }} level={3}>
          Hardware Store Inventory
        </Title>
      </Header>
      <Content style={{ padding: 20 }}>
        <InventoryTable />
      </Content>
    </Layout>
  );
}

export default App;
