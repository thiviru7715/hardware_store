import React from 'react';
import { Layout, Menu, Avatar, Input, Typography, Badge } from 'antd';
import {
    AppstoreOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    FileTextOutlined,
    TeamOutlined,
    BarChartOutlined,
    FolderOpenOutlined,
    BellOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    UserOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: '/', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: '/reports', icon: <FileTextOutlined />, label: 'Reports' }, // Renamed Inventory to Reports as requested
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} theme="dark" style={{ backgroundColor: '#1f1f1f' }}>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', backgroundColor: '#e53935', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShopOutlined style={{ color: 'white', fontSize: '18px' }} />
                    </div>
                    <Title level={4} style={{ color: 'white', margin: 0 }}>Inventory</Title>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    style={{ backgroundColor: '#1f1f1f' }}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#ff4d4f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>+</div>
                        <Input
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Search"
                            style={{ width: 300, borderRadius: '6px', backgroundColor: '#f5f5f5', border: 'none' }}
                            variant="borderless"
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontWeight: 500 }}>Zylker</span>
                        <Badge dot><BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} /></Badge>
                        <SettingOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
                        <QuestionCircleOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
                        <Avatar icon={<UserOutlined />} src="https://joesch.moe/api/v1/random" style={{ cursor: 'pointer' }} />
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
