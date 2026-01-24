import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge, Button, Drawer } from 'antd';
import {
    AppstoreOutlined,
    ShopOutlined,
    FileTextOutlined,
    BellOutlined,
    SettingOutlined,
    UserOutlined,
    MenuOutlined,
    CloseOutlined,
    LogoutOutlined,
    SafetyOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

import InstallPrompt from './InstallPrompt';

const MainLayout = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuItems = [
        { key: '/', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: '/reports', icon: <FileTextOutlined />, label: 'Reports' },
        { key: '/salaries', icon: <DollarOutlined />, label: 'Salaries' },
        { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
        setMobileMenuOpen(false);
    };

    const SidebarContent = () => (
        <>
            <div style={{
                padding: '24px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)'
                }}>
                    <ShopOutlined style={{ color: 'white', fontSize: '20px' }} />
                </div>
                <div>
                    <Title level={5} style={{ color: 'white', margin: 0 }}>Hardware Store</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Inventory System</Text>
                </div>
            </div>

            {/* User Profile in Sidebar */}
            <div style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.05)',
                margin: '12px',
                borderRadius: '12px'
            }}>
                <Avatar
                    size={40}
                    style={{
                        background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                        fontWeight: '600'
                    }}
                >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{
                        color: 'white',
                        display: 'block',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {user?.name || 'User'}
                    </Text>
                    <Text style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '11px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block'
                    }}>
                        {user?.email || 'email@example.com'}
                    </Text>
                </div>
            </div>

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0 8px'
                }}
                items={menuItems}
                onClick={handleMenuClick}
            />

            <div style={{ padding: '16px', marginTop: 'auto' }}>
                <InstallPrompt mobile={true} />
            </div>

            {/* Logout Button */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={onLogout}
                    block
                    style={{
                        color: 'rgba(255,255,255,0.7)',
                        textAlign: 'left',
                        height: '44px',
                        borderRadius: '10px'
                    }}
                >
                    Logout
                </Button>
            </div>
        </>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop Sidebar */}
            <Sider
                width={260}
                theme="dark"
                style={{
                    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
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
                width={280}
                styles={{
                    body: {
                        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column'
                    },
                    header: {
                        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                        borderBottom: 'none',
                        padding: '16px'
                    }
                }}
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
                    height: '64px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Mobile Menu Button */}
                        <Button
                            type="text"
                            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
                            onClick={() => setMobileMenuOpen(true)}
                            className="mobile-menu-btn"
                            style={{
                                display: 'none',
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px'
                            }}
                        />

                        {/* Mobile Logo */}
                        <div className="mobile-logo" style={{ display: 'none' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ShopOutlined style={{ color: 'white', fontSize: '18px' }} />
                            </div>
                        </div>

                        {/* Page Title */}
                        <Title level={4} style={{ margin: 0 }} className="page-title">
                            {location.pathname === '/' && 'Dashboard'}
                            {location.pathname === '/reports' && 'Reports'}
                            {location.pathname === '/salaries' && 'Salaries'}
                            {location.pathname === '/settings' && 'Settings'}
                        </Title>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="desktop-install-btn">
                            <InstallPrompt />
                        </div>

                        <Button
                            type="text"
                            icon={<BellOutlined style={{ fontSize: '18px' }} />}
                            style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                        />

                        <Button
                            type="text"
                            icon={<SettingOutlined style={{ fontSize: '18px' }} />}
                            onClick={() => navigate('/settings')}
                            style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                            className="desktop-settings-btn"
                        />

                        <Avatar
                            style={{
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                fontWeight: '600'
                            }}
                            onClick={() => navigate('/settings')}
                        >
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                    </div>
                </Header>

                <Content style={{
                    margin: '0',
                    padding: '16px',
                    minHeight: 'calc(100vh - 64px)',
                    background: '#f8f9fa',
                    overflowY: 'auto'
                }}>
                    <Outlet />
                </Content>
            </Layout>

            {/* CSS for responsive design */}
            <style>{`
                .ant-menu-dark .ant-menu-item {
                    margin: 4px 0 !important;
                    border-radius: 10px !important;
                    height: 44px !important;
                    line-height: 44px !important;
                }
                .ant-menu-dark .ant-menu-item-selected {
                    background: linear-gradient(135deg, #e53935 0%, #ff6b6b 100%) !important;
                }
                .ant-menu-dark .ant-menu-item:hover {
                    background: rgba(255,255,255,0.1) !important;
                }
                @media (min-width: 992px) {
                    .mobile-menu-btn { display: none !important; }
                    .mobile-logo { display: none !important; }
                    .desktop-install-btn { display: block !important; }
                    .desktop-settings-btn { display: inline-flex !important; }
                    .page-title { display: block !important; }
                }
                @media (max-width: 991px) {
                    .desktop-sider { display: none !important; }
                    .mobile-menu-btn { display: inline-flex !important; }
                    .mobile-logo { display: flex !important; }
                    .desktop-install-btn { display: none !important; }
                    .desktop-settings-btn { display: none !important; }
                    .page-title { display: none !important; }
                }
                @media (max-width: 576px) {
                    .ant-table { font-size: 12px; }
                    .ant-table-thead > tr > th { padding: 10px 6px !important; }
                    .ant-table-tbody > tr > td { padding: 10px 6px !important; }
                }
            `}</style>
        </Layout>
    );
};

export default MainLayout;
