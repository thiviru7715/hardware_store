import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Statistic } from 'antd';
import { LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { usersApi } from '../localStorageApi';

const { Title, Text } = Typography;

const SettingsPage = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleUpdatePin = async (values) => {
        setLoading(true);
        try {
            await usersApi.updatePin(user.email, values.pin);
            message.success('PIN updated successfully');
            form.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update PIN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>Settings</Title>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <Card title="Security Settings" extra={<SafetyOutlined style={{ color: '#1890ff' }} />}>
                    <Text strong style={{ display: 'block', marginBottom: '16px' }}>
                        Set up a PIN for quicker login access.
                    </Text>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdatePin}
                    >
                        <Form.Item
                            name="pin"
                            label="New 4-Digit PIN"
                            rules={[
                                { required: true, message: 'Please enter a PIN' },
                                { len: 4, message: 'PIN must be exactly 4 digits' },
                                { pattern: /^\d+$/, message: 'PIN must contain only numbers' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter 4 digits"
                                maxLength={4}
                                style={{ letterSpacing: '4px', maxWidth: '200px' }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update PIN
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="Account Info">
                    <Statistic title="Account Name" value={user.name} />
                    <Statistic title="Email" value={user.email} style={{ marginTop: 16 }} valueStyle={{ fontSize: 16 }} />
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
