import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Avatar, Divider } from 'antd';
import { LockOutlined, SafetyOutlined, UserOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { usersApi } from '../localStorageApi';

const { Title, Text } = Typography;

const SettingsPage = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [pinSet, setPinSet] = useState(false);
    const [form] = Form.useForm();

    const handleUpdatePin = async (values) => {
        setLoading(true);
        try {
            await usersApi.updatePin(user.email, values.pin);
            message.success('PIN updated successfully!');
            form.resetFields();
            setPinSet(true);
            setTimeout(() => setPinSet(false), 3000);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update PIN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            minHeight: 'calc(100vh - 120px)'
        }}>
            {/* Profile Header */}
            <Card
                style={{
                    borderRadius: '20px',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    border: 'none'
                }}
                bodyStyle={{ padding: '24px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Avatar
                        size={64}
                        style={{
                            background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            boxShadow: '0 8px 24px rgba(229, 57, 53, 0.3)'
                        }}
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                        <Title level={4} style={{ margin: 0, color: 'white' }}>
                            {user?.name || 'User'}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                            <MailOutlined style={{ marginRight: '6px' }} />
                            {user?.email || 'email@example.com'}
                        </Text>
                    </div>
                </div>
            </Card>

            {/* Security Settings */}
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <SafetyOutlined style={{ color: 'white', fontSize: '18px' }} />
                        </div>
                        <span style={{ fontWeight: '600' }}>PIN Security</span>
                    </div>
                }
                style={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
                bodyStyle={{ padding: '24px' }}
            >
                <Text style={{ display: 'block', marginBottom: '20px', color: '#666' }}>
                    Set up a 4-digit PIN for quick and secure access to your account.
                </Text>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdatePin}
                >
                    <Form.Item
                        name="pin"
                        label={<span style={{ fontWeight: '500' }}>New PIN</span>}
                        rules={[
                            { required: true, message: 'Please enter a PIN' },
                            { len: 4, message: 'PIN must be exactly 4 digits' },
                            { pattern: /^\d+$/, message: 'PIN must contain only numbers' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Enter 4 digits"
                            maxLength={4}
                            size="large"
                            style={{
                                letterSpacing: '8px',
                                fontSize: '20px',
                                fontWeight: '600',
                                textAlign: 'center',
                                borderRadius: '12px',
                                height: '56px',
                                maxWidth: '200px'
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={pinSet ? <CheckCircleOutlined /> : <LockOutlined />}
                            style={{
                                height: '48px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '600',
                                paddingLeft: '24px',
                                paddingRight: '24px',
                                background: pinSet
                                    ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
                                    : 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                border: 'none',
                                boxShadow: pinSet
                                    ? '0 4px 16px rgba(82, 196, 26, 0.3)'
                                    : '0 4px 16px rgba(229, 57, 53, 0.3)'
                            }}
                        >
                            {pinSet ? 'PIN Updated!' : 'Update PIN'}
                        </Button>
                    </Form.Item>
                </Form>

                <Divider style={{ margin: '24px 0' }} />

                <div style={{
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#e6f7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <SafetyOutlined style={{ color: '#1890ff' }} />
                    </div>
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                            Quick Tip
                        </Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Use the PIN Login tab on the login page for faster access.
                            Your PIN should be easy to remember but hard to guess.
                        </Text>
                    </div>
                </div>
            </Card>

            <style>{`
                .ant-input-affix-wrapper:focus,
                .ant-input-affix-wrapper-focused {
                    border-color: #e53935 !important;
                    box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.1) !important;
                }
                @media (max-width: 480px) {
                    .ant-card-body {
                        padding: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default SettingsPage;
