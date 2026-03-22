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
                    borderRadius: '24px',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -6px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}
                bodyStyle={{ padding: '32px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Avatar
                        size={80}
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                            fontSize: '32px',
                            fontWeight: '800',
                            boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)',
                            border: '4px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                        <Title level={3} style={{ margin: 0, color: 'white', letterSpacing: '-0.5px' }}>
                            {user?.name || 'User'}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginTop: '4px', display: 'block' }}>
                            <MailOutlined style={{ marginRight: '8px', color: '#ef4444' }} />
                            {user?.email || 'email@example.com'}
                        </Text>
                    </div>
                </div>
            </Card>

            {/* Security Settings */}
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <LockOutlined style={{ fontSize: '20px' }} />
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.5px' }}>PIN Authentication</span>
                    </div>
                }
                style={{
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.02)',
                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)',
                    background: '#fff'
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
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    border: '1px solid rgba(0,0,0,0.02)'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <SafetyOutlined style={{ color: '#3b82f6', fontSize: '18px' }} />
                    </div>
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#1e293b' }}>
                            Security Recommendation
                        </Text>
                        <Text style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                            Enable PIN access for ultra-fast dashboard unlocking. 
                            Store your credentials in a secure password manager.
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
