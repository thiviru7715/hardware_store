import React, { useEffect, useState } from 'react';
import { Typography, Spin, Input, Tag, Empty } from 'antd';
import {
    SearchOutlined,
    AppstoreOutlined,
    DollarOutlined,
    WarningOutlined,
    InboxOutlined,
} from '@ant-design/icons';
import { itemsApi } from '../localStorageApi';

const { Title, Text } = Typography;

/* ─── tiny stat card ─────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, color, bg }) => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        flex: '1 1 140px',
        minWidth: 0,
    }}>
        <div style={{
            width: 46, height: 46,
            borderRadius: '12px',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            {React.cloneElement(icon, { style: { color, fontSize: 22 } })}
        </div>
        <div style={{ minWidth: 0 }}>
            <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block' }}>{label}</Text>
            <Text strong style={{ fontSize: 20, color: '#1a1a2e', lineHeight: 1.2 }}>{value}</Text>
        </div>
    </div>
);

/* ─── single item row / card ──────────────────────────────────────── */
const ItemCard = ({ item, index }) => {
    const isLow = item.quantity <= 5;
    return (
        <div style={{
            background: '#fff',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            borderLeft: isLow ? '4px solid #ff4d4f' : '4px solid transparent',
            transition: 'box-shadow 0.2s',
        }}>
            {/* Left: index + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div style={{
                    width: 34, height: 34, borderRadius: '10px',
                    background: 'linear-gradient(135deg,#e53935 0%,#ff6b6b 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                    {index + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                    <Text strong style={{
                        display: 'block', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        color: '#1a1a2e', fontSize: 14,
                    }}>
                        {item.name}
                    </Text>
                    {isLow && (
                        <Tag color="error" style={{ marginTop: 2, fontSize: 10 }}>Low Stock</Tag>
                    )}
                </div>
            </div>

            {/* Right: price + qty */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <Text strong style={{ display: 'block', color: '#e53935', fontSize: 15 }}>
                    Rs.{Number(item.price)?.toFixed(2) || '0.00'}
                </Text>
                <Text style={{ color: '#8c8c8c', fontSize: 12 }}>
                    Qty: {item.quantity}
                </Text>
            </div>
        </div>
    );
};

/* ─── main page ───────────────────────────────────────────────────── */
const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalValue = items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity || 0)), 0);
    const lowStock = items.filter(i => i.quantity <= 5).length;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            height: '100%',
            maxWidth: '100%',
        }}>
            {/* ── Stats Row ──────────────────────────────────── */}
            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
            }}>
                <StatCard
                    icon={<AppstoreOutlined />}
                    label="Total Items"
                    value={items.length}
                    color="#1890ff"
                    bg="#e6f7ff"
                />
                <StatCard
                    icon={<DollarOutlined />}
                    label="Stock Value"
                    value={`Rs.${totalValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
                    color="#52c41a"
                    bg="#f6ffed"
                />
                <StatCard
                    icon={<WarningOutlined />}
                    label="Low Stock"
                    value={lowStock}
                    color={lowStock > 0 ? '#ff4d4f' : '#8c8c8c'}
                    bg={lowStock > 0 ? '#fff1f0' : '#f5f5f5'}
                />
            </div>

            {/* ── Search ─────────────────────────────────────── */}
            <Input
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Search items…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                allowClear
                style={{
                    borderRadius: '12px',
                    height: '44px',
                    fontSize: 15,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                    border: '1.5px solid #f0f0f0',
                }}
            />

            {/* ── Items List ─────────────────────────────────── */}
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* List header */}
                <div style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <InboxOutlined style={{ color: '#e53935', fontSize: 18 }} />
                        <Title level={5} style={{ margin: 0 }}>Item Inventory</Title>
                    </div>
                    <Tag style={{ borderRadius: 20, fontSize: 12 }}>{filtered.length} items</Tag>
                </div>

                {/* Scrollable list */}
                <div style={{
                    overflowY: 'auto',
                    flex: 1,
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: 'calc(100vh - 280px)',   /* keeps it on 1 page */
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <Empty description="No items found" style={{ padding: '40px 0' }} />
                    ) : (
                        filtered.map((item, i) => (
                            <ItemCard key={item.id || i} item={item} index={i} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
