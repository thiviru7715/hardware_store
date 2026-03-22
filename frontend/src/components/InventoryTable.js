import { Table, Button, InputNumber, message, Modal, Form, Input, Space, Card, List, Typography, Tag } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { itemsApi } from "../localStorageApi";

const { Title, Text } = Typography;

function InventoryTable() {
    const [items, setItems] = useState([]);
    const [amount, setAmount] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadItems = async () => {
        try {
            const res = await itemsApi.getAll();
            setItems(res.data);
        } catch (error) {
            message.error("Failed to load items");
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const increase = async (id) => {
        try {
            await itemsApi.increase(id, amount);
            message.success("Stock increased");
            loadItems();
        } catch (error) {
            message.error("Failed to increase stock");
        }
    };

    const decrease = async (id) => {
        try {
            await itemsApi.decrease(id, amount);
            message.success("Stock decreased");
            loadItems();
        } catch {
            message.error("Not enough stock or error occurred");
        }
    };

    const deleteItem = async (id) => {
        Modal.confirm({
            title: 'Delete Item',
            content: 'Are you sure you want to delete this item?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await itemsApi.delete(id);
                    message.success("Item deleted");
                    loadItems();
                } catch (error) {
                    message.error("Failed to delete item");
                }
            }
        });
    };

    const handleAddObject = async (values) => {
        try {
            await itemsApi.create(values);
            message.success("Item added successfully");
            setIsModalOpen(false);
            form.resetFields();
            loadItems();
        } catch (error) {
            message.error("Failed to add item");
        }
    };

    const openEditModal = (record) => {
        setEditingItem(record);
        editForm.setFieldsValue({
            name: record.name,
            price: record.price,
            quantity: record.quantity
        });
        setIsEditModalOpen(true);
    };

    const handleEditItem = async (values) => {
        try {
            await itemsApi.update(editingItem.id, values);
            message.success("Item updated successfully");
            setIsEditModalOpen(false);
            editForm.resetFields();
            setEditingItem(null);
            loadItems();
        } catch (error) {
            message.error("Failed to update item");
        }
    };

    const columns = [
        {
            title: "Item",
            dataIndex: "name",
            ellipsis: true,
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (price) => `Rs. ${Number(price)?.toFixed(2) || '0.00'}`,
            width: 110,
        },
        {
            title: "Qty",
            dataIndex: "quantity",
            width: 60,
        },
        {
            title: "Actions",
            width: 180,
            render: (_, record) => (
                <Space size="small" wrap>
                    <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => increase(record.id)}
                        style={{ borderRadius: '8px' }}
                    />
                    <Button
                        size="small"
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => decrease(record.id)}
                        style={{ borderRadius: '8px' }}
                    />
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        style={{ borderRadius: '8px', color: '#1890ff', borderColor: '#1890ff' }}
                    />
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteItem(record.id)}
                        style={{ borderRadius: '8px' }}
                    />
                </Space>
            )
        }
    ];

    // Mobile Card Component
    const MobileItemCard = ({ item }) => (
        <Card
            style={{
                marginBottom: '12px',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            bodyStyle={{ padding: '16px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                        {item.name}
                    </Text>
                    <Text style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#e53935',
                        display: 'block'
                    }}>
                        Rs. {Number(item.price)?.toFixed(2)}
                    </Text>
                </div>
                <Tag
                    color={item.quantity > 10 ? 'green' : item.quantity > 0 ? 'orange' : 'red'}
                    style={{
                        fontSize: '14px',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontWeight: '600'
                    }}
                >
                    {item.quantity} in stock
                </Tag>
            </div>

            <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'space-between',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '12px'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => increase(item.id)}
                        style={{
                            borderRadius: '10px',
                            height: '40px',
                            width: '40px',
                            background: '#f6ffed',
                            borderColor: '#b7eb8f',
                            color: '#52c41a'
                        }}
                    />
                    <Button
                        icon={<MinusOutlined />}
                        onClick={() => decrease(item.id)}
                        style={{
                            borderRadius: '10px',
                            height: '40px',
                            width: '40px',
                            background: '#fff2e8',
                            borderColor: '#ffbb96',
                            color: '#fa541c'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(item)}
                        style={{
                            borderRadius: '10px',
                            height: '40px',
                            width: '40px',
                            background: '#e6f7ff',
                            borderColor: '#91d5ff',
                            color: '#1890ff'
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => deleteItem(item.id)}
                        style={{
                            borderRadius: '10px',
                            height: '40px',
                            width: '40px',
                            background: '#fff1f0',
                            borderColor: '#ffa39e',
                            color: '#ff4d4f'
                        }}
                    />
                </div>
            </div>
        </Card>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Controls */}
            <div style={{
                marginBottom: 16,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <InputNumber
                        min={1}
                        value={amount}
                        onChange={setAmount}
                        addonBefore="Qty"
                        style={{ width: 110 }}
                    />
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        borderRadius: '10px',
                        height: '40px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                        border: 'none',
                        fontWeight: '600'
                    }}
                >
                    Add Item
                </Button>
            </div>

            {/* Content - Mobile Cards or Desktop Table */}
            {isMobile ? (
                <div>
                    {items.length === 0 ? (
                        <Card style={{ textAlign: 'center', borderRadius: '16px', padding: '40px' }}>
                            <Text type="secondary">No items yet. Add your first item!</Text>
                        </Card>
                    ) : (
                        items.map(item => (
                            <MobileItemCard key={item.id} item={item} />
                        ))
                    )}
                </div>
            ) : (
                <Card
                    style={{
                        borderRadius: '24px',
                        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.02)',
                        overflow: 'hidden',
                        background: '#fff',
                    }}
                    bodyStyle={{ padding: '0' }}
                >
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={items}
                        scroll={{ x: 500 }}
                        pagination={{
                            pageSize: 10,
                            responsive: true,
                            showSizeChanger: false,
                            position: ['bottomCenter'],
                            style: { padding: '16px 0' }
                        }}
                        style={{ borderRadius: '12px' }}
                    />
                </Card>
            )}

            {/* Add Item Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <PlusOutlined style={{ color: 'white' }} />
                        </div>
                        <span>Add New Item</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width="90%"
                style={{ maxWidth: 400 }}
            >
                <Form form={form} layout="vertical" onFinish={handleAddObject} style={{ marginTop: '16px' }}>
                    <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                        <Input size="large" style={{ borderRadius: '10px' }} />
                    </Form.Item>
                    <Form.Item name="price" label="Price (Rs.)" rules={[{ required: true }]}>
                        <InputNumber
                            size="large"
                            style={{ width: '100%', borderRadius: '10px' }}
                            min={0}
                            precision={2}
                        />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber
                            size="large"
                            style={{ width: '100%', borderRadius: '10px' }}
                            min={0}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            style={{
                                borderRadius: '10px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                border: 'none',
                                fontWeight: '600'
                            }}
                        >
                            Add Item
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Item Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <EditOutlined style={{ color: 'white' }} />
                        </div>
                        <span>Edit Item</span>
                    </div>
                }
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    editForm.resetFields();
                    setEditingItem(null);
                }}
                footer={null}
                width="90%"
                style={{ maxWidth: 400 }}
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditItem} style={{ marginTop: '16px' }}>
                    <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                        <Input size="large" style={{ borderRadius: '10px' }} />
                    </Form.Item>
                    <Form.Item name="price" label="Price (Rs.)" rules={[{ required: true }]}>
                        <InputNumber
                            size="large"
                            style={{ width: '100%', borderRadius: '10px' }}
                            min={0}
                            precision={2}
                        />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber
                            size="large"
                            style={{ width: '100%', borderRadius: '10px' }}
                            min={0}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            style={{
                                borderRadius: '10px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)',
                                border: 'none',
                                fontWeight: '600'
                            }}
                        >
                            Update Item
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default InventoryTable;
