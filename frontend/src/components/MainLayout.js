import React, { useState } from 'react';
import { Layout, Menu, Avatar, Input, Typography, Badge, Button, Drawer } from 'antd';
import {
    AppstoreOutlined,
    ShopOutlined,
    FileTextOutlined,
    BellOutlined,
    SettingOutlined,
    UserOutlined,
    SearchOutlined,
    MenuOutlined,
    CloseOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

import InstallPrompt from './InstallPrompt';

const MainLayout = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuItems = [
        { key: '/', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: '/reports', icon: <FileTextOutlined />, label: 'Reports' },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
        setMobileMenuOpen(false);
    };

    const SidebarContent = () => (
        <>
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
                onClick={handleMenuClick}
            />
            <div style={{ padding: '10px' }}>
                <InstallPrompt mobile={true} />
            </div>
        </>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop Sidebar */}
            <Sider
                width={250}
                theme="dark"
                style={{ backgroundColor: '#1f1f1f' }}
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null}
                className="desktop-sider"
            >
                <SidebarContent />
            </Sider>

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={250}
                bodyStyle={{ backgroundColor: '#1f1f1f', padding: 0 }}
                headerStyle={{ backgroundColor: '#1f1f1f', borderBottom: 'none' }}
                closeIcon={<CloseOutlined style={{ color: 'white' }} />}
            >
                <SidebarContent />
            </Drawer>

            <Layout>
                <Header style={{
                    padding: '0 16px',
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    flexWrap: 'wrap',
                    height: 'auto',
                    minHeight: '64px'
                }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {/* Mobile Menu Button */}
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setMobileMenuOpen(true)}
                            className="mobile-menu-btn"
                            style={{ display: 'none' }}
                        />
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#ff4d4f',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer'
                        }}>+</div>
                        <Input
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Search"
                            style={{
                                width: 'clamp(150px, 30vw, 300px)',
                                borderRadius: '6px',
                                backgroundColor: '#f5f5f5',
                                border: 'none'
                            }}
                            variant="borderless"
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="desktop-install-btn">
                            <InstallPrompt />
                        </div>
                        <span style={{ fontWeight: 500 }} className="header-text">{user?.name || 'User'}</span>
                        <Badge dot><BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} /></Badge>
                        <SettingOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={onLogout}
                            title="Logout"
                        />
                        <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer', backgroundColor: '#e53935' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    </div>
                </Header>
                <Content style={{ margin: '16px', padding: 16, minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>

            {/* CSS for responsive design */}
            <style>{`
                @media (min-width: 992px) {
                    .mobile-menu-btn { display: none !important; }
                    .header-text { display: inline !important; }
                    .header-icon { display: inline !important; }
                    .desktop-install-btn { display: block !important; }
                }
                @media (max-width: 991px) {
                    .desktop-sider { display: none !important; }
                    .mobile-menu-btn { display: inline-flex !important; }
                    .desktop-install-btn { display: none !important; }
                }
                @media (max-width: 576px) {
                    .ant-table { font-size: 12px; }
                    .ant-table-thead > tr > th { padding: 8px 4px !important; }
                    .ant-table-tbody > tr > td { padding: 8px 4px !important; }
                }
            `}</style>
        </Layout>
    );
};

export default MainLayout;

