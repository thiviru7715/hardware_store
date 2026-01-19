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
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 8px 24px rgba(229, 57, 53, 0.3)'
                        }}>
                            <LockOutlined style={{ fontSize: '32px', color: 'white' }} />
                        </div>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            Enter your 4-digit PIN to login
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
                                placeholder="• • • •"
                                maxLength={4}
                                size="large"
                                style={{
                                    textAlign: 'center',
                                    letterSpacing: '16px',
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    height: '64px',
                                    borderRadius: '12px',
                                    border: '2px solid #e0e0e0',
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
                                    height: '52px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 16px rgba(229, 57, 53, 0.3)'
                                }}
                            >
                                Unlock
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
                <Form form={loginForm} layout="vertical" onFinish={handleLogin} style={{ padding: '16px 0' }}>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Email address"
                            size="large"
                            style={{ borderRadius: '10px', height: '48px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Password"
                            size="large"
                            style={{ borderRadius: '10px', height: '48px' }}
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
                            Sign In
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
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            padding: '16px',
            boxSizing: 'border-box'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    border: 'none',
                    overflow: 'hidden'
                }}
                bodyStyle={{ padding: '32px 24px 24px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 10px 30px rgba(229, 57, 53, 0.3)',
                        transform: 'rotate(-5deg)'
                    }}>
                        <span style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}>H</span>
                    </div>
                    <Title level={3} style={{ margin: '0 0 4px', fontWeight: '700' }}>Hardware Store</Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Inventory Management System</Text>
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
