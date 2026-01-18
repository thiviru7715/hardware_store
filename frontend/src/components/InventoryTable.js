import { Table, Button, InputNumber, message, Modal, Form, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import API from "../api";

function InventoryTable() {
    const [items, setItems] = useState([]);
    const [amount, setAmount] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const loadItems = async () => {
        try {
            const res = await API.get("/items");
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
            await API.put(`/items/increase/${id}`, { amount });
            message.success("Stock increased");
            loadItems();
        } catch (error) {
            message.error("Failed to increase stock");
        }
    };

    const decrease = async (id) => {
        try {
            await API.put(`/items/decrease/${id}`, { amount });
            message.success("Stock decreased");
            loadItems();
        } catch {
            message.error("Not enough stock or error occurred");
        }
    };

    const deleteItem = async (id) => {
        try {
            await API.delete(`/items/${id}`);
            message.success("Item deleted");
            loadItems();
        } catch (error) {
            message.error("Failed to delete item");
        }
    };

    const handleAddObject = async (values) => {
        try {
            await API.post("/items", values);
            message.success("Item added successfully");
            setIsModalOpen(false);
            form.resetFields();
            loadItems();
        } catch (error) {
            message.error("Failed to add item");
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
            render: (price) => `Rs. ${price?.toFixed(2) || '0.00'}`,
            width: 100,
        },
        {
            title: "Qty",
            dataIndex: "quantity",
            width: 60,
        },
        {
            title: "Actions",
            width: 150,
            render: (_, record) => (
                <Space size="small" wrap>
                    <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => increase(record.id)}
                    />
                    <Button
                        size="small"
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => decrease(record.id)}
                    />
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteItem(record.id)}
                    />
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{
                marginBottom: 16,
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <InputNumber
                    min={1}
                    value={amount}
                    onChange={setAmount}
                    addonBefore="Qty"
                    style={{ width: 120 }}
                />
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add Item
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={items}
                scroll={{ x: 500 }}
                pagination={{
                    pageSize: 10,
                    responsive: true,
                    showSizeChanger: false
                }}
            />

            <Modal
                title="Add New Item"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width="90%"
                style={{ maxWidth: 400 }}
            >
                <Form form={form} layout="vertical" onFinish={handleAddObject}>
                    <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Item
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default InventoryTable;

