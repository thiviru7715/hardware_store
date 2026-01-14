import { Table, Button, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import API from "../api";

function InventoryTable() {
    const [items, setItems] = useState([]);
    const [amount, setAmount] = useState(1);

    const loadItems = async () => {
        const res = await API.get("/items");
        setItems(res.data);
    };

    useEffect(() => {
        loadItems();
    }, []);

    const increase = async (id) => {
        await API.put(`/items/increase/${id}`, { amount });
        message.success("Stock increased");
        loadItems();
    };

    const decrease = async (id) => {
        try {
            await API.put(`/items/decrease/${id}`, { amount });
            message.success("Stock decreased");
            loadItems();
        } catch {
            message.error("Not enough stock");
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
                </>
            )
        }
    ];

    return (
        <>
            <InputNumber min={1} value={amount} onChange={setAmount} />
            <Table rowKey="id" columns={columns} dataSource={items} />
        </>
    );
}

export default InventoryTable;
