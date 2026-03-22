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

/* ─── tiny stat card ───────────────────────── */
const StatCard = ({ icon, label, value, color, bg }) => (
    <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.02)',
        flex: '1 1 200px',
        minWidth: 0,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    }}
    onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.06), 0 10px 10px -6px rgba(0,0,0,0.04)';
    }}
    onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04)';
    }}>
        <div style={{
            width: 52, height: 52,
            borderRadius: '14px',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${color}20`,
        }}>
            {React.cloneElement(icon, { style: { color, fontSize: 24 } })}
        </div>
        <div style={{ minWidth: 0 }}>
            <Text style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>{label}</Text>
            <Text strong style={{ fontSize: '24px', color: '#111827', lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</Text>
        </div>
    </div>
);

/* ─── single item row / card ──────────────────────────────────────── */
const ItemCard = ({ item, index }) => {
    const isLow = item.quantity <= 5;
    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
            border: isLow ? '1px solid #fee2e2' : '1px solid #f3f4f6',
            background: isLow ? 'linear-gradient(to right, #fff, #fff5f5)' : '#fff',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateX(4px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = isLow ? '#fecaca' : '#e5e7eb';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)';
            e.currentTarget.style.borderColor = isLow ? '#fee2e2' : '#f3f4f6';
        }}>
            {/* Left: index + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: '12px',
                    background: isLow ? 'linear-gradient(135deg,#ef4444 0%,#f87171 100%)' : 'linear-gradient(135deg,#6b7280 0%,#9ca3af 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0,
                    boxShadow: isLow ? '0 4px 10px rgba(239, 68, 68, 0.25)' : 'none',
                }}>
                    {index + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                    <Text strong style={{
                        display: 'block', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        color: '#111827', fontSize: '15px',
                        letterSpacing: '-0.3px',
                    }}>
                        {item.name}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <Text style={{ color: '#6b7280', fontSize: '12px' }}>ID: {item.id?.substring(0, 8) || 'N/A'}</Text>
                        {isLow && (
                            <Tag bordered={false} color="error" style={{ fontSize: '10px', borderRadius: '6px', fontWeight: 600 }}>Low Stock</Tag>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: price + qty */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <Text strong style={{ display: 'block', color: '#ef4444', fontSize: '16px', fontWeight: 700 }}>
                    Rs.{Number(item.price)?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <InboxOutlined style={{ fontSize: '12px', color: '#9ca3af' }} />
                    <Text style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>
                        {item.quantity} units
                    </Text>
                </div>
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
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(to right, #ffffff, #fafafa)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: '10px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <InboxOutlined style={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px', fontSize: 18 }}>Product Inventory</Title>
                            <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Real-time stock monitoring</Text>
                        </div>
                    </div>
                    <Tag bordered={false} style={{ borderRadius: 20, fontSize: 14, padding: '4px 12px', background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                        {filtered.length} Items
                    </Tag>
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
