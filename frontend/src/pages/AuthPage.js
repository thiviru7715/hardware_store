import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, NumberOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../localStorageApi';

const { Title, Text } = Typography;

const AuthPage = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('pin');
    const navigate = useNavigate();
    const [loginForm] = Form.useForm();
    const [pinForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const res = await usersApi.login(values);
            message.success('Login successful!');
            onLogin(res.data.user);
            navigate('/');
        } catch (error) {
            message.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePinLogin = async (values) => {
        setLoading(true);
        try {
            const res = await usersApi.loginWithPin(values.pin);
            message.success('Login successful!');
            onLogin(res.data.user);
            navigate('/');
        } catch (error) {
            message.error(error.response?.data?.message || 'PIN Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            await usersApi.register(values);
            message.success('Registration successful! Please login.');
            setActiveTab('login');
            registerForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: 'pin',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <NumberOutlined /> Quick PIN
                </span>
            ),
            children: (
                <div style={{ padding: '20px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '84px',
                            height: '84px',
                            background: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                        }}>
                            <LockOutlined style={{ fontSize: '36px', color: '#ef4444' }} />
                        </div>
                        <Text style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>
                            Secure Pin Access
                        </Text>
                    </div>
                    <Form form={pinForm} layout="vertical" onFinish={handlePinLogin}>
                        <Form.Item
                            name="pin"
                            rules={[
                                { required: true, message: 'Please enter your PIN' },
                                { len: 4, message: 'PIN must be 4 digits' }
                            ]}
                        >
                            <Input.Password
                                placeholder="0000"
                                maxLength={4}
                                size="large"
                                style={{
                                    textAlign: 'center',
                                    letterSpacing: '24px',
                                    fontSize: '32px',
                                    fontWeight: '900',
                                    height: '72px',
                                    borderRadius: '20px',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    paddingLeft: '24px'
                                }}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                style={{
                                    height: '56px',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
                                }}
                            >
                                Unlock Dashboard
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: 'login',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MailOutlined /> Email
                </span>
            ),
            children: (
                <Form form={loginForm} layout="vertical" onFinish={handleLogin} style={{ padding: '24px 0 0' }}>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />}
                            placeholder="Email address"
                            size="large"
                            style={{ borderRadius: '14px', height: '52px', background: '#f8fafc' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />}
                            placeholder="Password"
                            size="large"
                            style={{ borderRadius: '14px', height: '52px', background: '#f8fafc' }}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, marginTop: '12px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                height: '52px',
                                borderRadius: '14px',
                                fontSize: '16px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                                border: 'none',
                                boxShadow: '0 8px 15px -3px rgba(239, 68, 68, 0.25)'
                            }}
                        >
                            Log Into Account
                        </Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: 'register',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserOutlined /> Register
                </span>
            ),
            children: (
                <Form form={registerForm} layout="vertical" onFinish={handleRegister} style={{ padding: '12px 0' }}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                        style={{ marginBottom: '12px' }}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Full Name"
                            size="large"
                            style={{ borderRadius: '10px', height: '44px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                        style={{ marginBottom: '12px' }}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Email address"
                            size="large"
                            style={{ borderRadius: '10px', height: '44px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                        style={{ marginBottom: '12px' }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Password"
                            size="large"
                            style={{ borderRadius: '10px', height: '44px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Confirm Password"
                            size="large"
                            style={{ borderRadius: '10px', height: '44px' }}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                height: '48px',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                border: 'none'
                            }}
                        >
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>
            )
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            padding: '24px',
            boxSizing: 'border-box'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 440,
                    borderRadius: '32px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                }}
                bodyStyle={{ padding: '40px 32px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 15px 30px rgba(239, 68, 68, 0.35)',
                        transform: 'rotate(-4deg)'
                    }}>
                        <span style={{
                            color: 'white',
                            fontSize: '40px',
                            fontWeight: '900',
                            fontFamily: "'Inter', sans-serif"
                        }}>H</span>
                    </div>
                    <Title level={2} style={{ margin: '0 0 4px', fontWeight: '800', letterSpacing: '-1px' }}>Hardware Store</Title>
                    <Text style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>Global Inventory Control</Text>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    centered
                    size="small"
                />
            </Card>

            <style>{`
                .ant-tabs-tab {
                    padding: 8px 12px !important;
                    font-size: 13px !important;
                }
                .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #e53935 !important;
                    font-weight: 600 !important;
                }
                .ant-tabs-ink-bar {
                    background: linear-gradient(90deg, #e53935 0%, #ff6b6b 100%) !important;
                    height: 3px !important;
                    border-radius: 2px !important;
                }
                .ant-input-affix-wrapper:focus,
                .ant-input-affix-wrapper-focused {
                    border-color: #e53935 !important;
                    box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.1) !important;
                }
                .ant-input-password .ant-input {
                    font-family: inherit !important;
                }
                @media (max-width: 480px) {
                    .ant-card-body {
                        padding: 24px 16px 16px !important;
                    }
                    .ant-tabs-tab {
                        padding: 6px 8px !important;
                        font-size: 12px !important;
                    }
                }
                @media (max-height: 700px) {
                    .ant-card-body {
                        padding: 20px 16px 12px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuthPage;
