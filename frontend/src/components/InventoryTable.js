import { Table, Button, InputNumber, message, Modal, Form, Input } from "antd";
import { useEffect, useState } from "react";
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
        { title: "Item", dataIndex: "name" },
        { title: "Price", dataIndex: "price" },
        { title: "Quantity", dataIndex: "quantity" },
        {
            title: "Actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => increase(record.id)}>+</Button>
                    <Button danger onClick={() => decrease(record.id)} style={{ marginLeft: 8 }}>
                        -
                    </Button>
                    <Button type="primary" danger onClick={() => deleteItem(record.id)} style={{ marginLeft: 8 }}>
                        Delete
                    </Button>
                </>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
                <InputNumber min={1} value={amount} onChange={setAmount} addonBefore="Adjust Amount" />
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Add Item</Button>
            </div>

            <Table rowKey="id" columns={columns} dataSource={items} />

            <Modal title="Add New Item" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
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
