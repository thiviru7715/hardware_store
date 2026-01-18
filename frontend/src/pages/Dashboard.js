import React, { useEffect, useState } from 'react';
import { Card, Typography, Table, Spin } from 'antd';
import { itemsApi } from '../localStorageApi';

const { Title } = Typography;

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await itemsApi.getAll();
                setItems(res.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const columns = [
        { title: 'Item Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `Rs. ${price?.toFixed(2) || '0.00'}`
        },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    ];

    return (
        <div>
            <Title level={3}>Item Properties</Title>
            <Card style={{ borderRadius: '8px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={items}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 400 }}
                    />
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
