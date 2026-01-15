import React from 'react';
import { Row, Col, Card, Typography, Statistic, Progress, Table, Tag } from 'antd';
import {
    SafetyCertificateOutlined,
    ShoppingOutlined,
    CarOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard = () => {
    // Mock Data
    const salesActivity = [
        { title: 'Qty', value: 228, sub: 'TO BE PACKED', icon: <SafetyCertificateOutlined />, color: '#1890ff' },
        { title: 'Pkgs', value: 6, sub: 'TO BE SHIPPED', icon: <ShoppingOutlined />, color: '#f5222d' },
        { title: 'Pkgs', value: 10, sub: 'TO BE DELIVERED', icon: <CarOutlined />, color: '#52c41a' },
        { title: 'Qty', value: 474, sub: 'TO BE INVOICED', icon: <CheckCircleOutlined />, color: '#faad14' },
    ];

    const topSelling = [
        { key: 1, name: 'Hanswooly Cotton Cas...', stock: 171, unit: 'pcs', img: 'https://via.placeholder.com/50/FFA500/FFFFFF?text=Shirt' },
        { key: 2, name: 'Cutiepie Rompers-spo...', stock: 45, unit: 'sets', img: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=Romper' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Sales Activity Row */}
            <div>
                <Title level={4}>Sales Activity</Title>
                <Row gutter={[16, 16]}>
                    {salesActivity.map((item, index) => (
                        <Col xs={24} sm={12} md={6} key={index}>
                            <Card hoverable style={{ textAlign: 'center', height: '100%', borderRadius: '8px' }}>
                                <Title level={2} style={{ color: item.color, margin: 0 }}>{item.value}</Title>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{item.title}</Text>
                                <div style={{ marginTop: '10px', fontSize: '12px', color: '#8c8c8c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                    {item.icon} {item.sub}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <Row gutter={[24, 24]}>
                {/* Inventory Summary */}
                <Col xs={24} lg={16}>
                    <Title level={4}>Inventory Summary</Title>
                    <Card style={{ borderRadius: '8px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col span={12} style={{ borderRight: '1px solid #f0f0f0' }}>
                                <Text type="secondary">QUANTITY IN HAND</Text>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '5px' }}>
                                    <Title level={3} style={{ margin: 0 }}>10458</Title>
                                    <Text type="success">(+5%)</Text>
                                </div>
                            </Col>
                            <Col span={12} style={{ paddingLeft: '24px' }}>
                                <Text type="secondary">QUANTITY TO BE RECEIVED</Text>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '5px' }}>
                                    <Title level={3} style={{ margin: 0 }}>168</Title>
                                    <Text type="secondary">pcs</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <div style={{ marginTop: '24px' }}>
                        <Title level={4}>Product Details</Title>
                        <Card style={{ borderRadius: '8px' }}>
                            <Row>
                                <Col span={12} style={{ borderRight: '1px solid #f0f0f0', paddingRight: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <Text style={{ color: '#ff4d4f' }}>Low Stock Items</Text>
                                        <Title level={5} style={{ margin: 0 }}>3</Title>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <Text>All Item Group</Text>
                                        <Title level={5} style={{ margin: 0 }}>39</Title>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <Text>All Items</Text>
                                        <Title level={5} style={{ margin: 0 }}>190</Title>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#faad14' }}>Unconfirmed Items</Text>
                                        <Title level={5} style={{ margin: 0 }}>121</Title>
                                    </div>
                                </Col>
                                <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text strong>Active Items</Text>
                                    <Progress type="circle" percent={71} strokeColor="#52c41a" style={{ marginTop: '10px' }} />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>

                {/* Top Selling Items & Orders */}
                <Col xs={24} lg={8}>
                    <Title level={4}>Top Selling Items</Title>
                    <Card style={{ borderRadius: '8px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            {topSelling.map(item => (
                                <div key={item.key} style={{ textAlign: 'center', flex: 1, border: '1px solid #f0f0f0', borderRadius: '8px', padding: '10px' }}>
                                    <div style={{ width: '50px', height: '50px', backgroundColor: '#eee', margin: '0 auto 10px', backgroundImage: `url(${item.img})`, backgroundSize: 'cover' }}></div>
                                    <Text strong style={{ fontSize: '12px', display: 'block', height: '36px', overflow: 'hidden' }}>{item.name}</Text>
                                    <Title level={4} style={{ margin: '5px 0 0' }}>{item.stock} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>{item.unit}</span></Title>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Title level={4}>Purchase Order</Title>
                    <Card style={{ borderRadius: '8px', textAlign: 'center' }}>
                        <Text type="secondary">This Month</Text>
                        <div style={{ margin: '20px 0' }}>
                            <Text type="secondary" style={{ display: 'block' }}>Quantity Ordered</Text>
                            <Title level={2} style={{ color: '#1890ff', margin: 0 }}>652.00</Title>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
