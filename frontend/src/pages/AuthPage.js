import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const { Title, Text } = Typography;

const AuthPage = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const res = await API.post('/users/login', values);
            message.success('Login successful!');
            localStorage.setItem('user', JSON.stringify(res.data.user));
            onLogin(res.data.user);
            navigate('/');
        } catch (error) {
            message.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const res = await API.post('/users/register', values);
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
            key: 'login',
            label: 'Sign In',
            children: (
                <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: 'register',
            label: 'Create Account',
            children: (
                <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Full Name"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
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
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1f1f1f 0%, #434343 100%)',
            padding: '20px'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#e53935',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>H</span>
                    </div>
                    <Title level={3} style={{ margin: 0 }}>Hardware Store</Title>
                    <Text type="secondary">Inventory Management System</Text>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    centered
                />
            </Card>

            <style>{`
                @media (max-width: 480px) {
                    .ant-card-body {
                        padding: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuthPage;
