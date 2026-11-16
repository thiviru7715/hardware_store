// Tool Shop – Machinery section
import React, { useEffect, useMemo, useState } from 'react';
import {
    Table, Button, InputNumber, message, Modal, Form, Input, Select, AutoComplete,
    Space, Card, Typography, Tag, Empty, Spin, Tooltip, Row, Col,
} from 'antd';
import {
    PlusOutlined, MinusOutlined, DeleteOutlined, EditOutlined, SearchOutlined,
    ToolOutlined, DollarOutlined, WarningOutlined, ClockCircleOutlined,
    HistoryOutlined, UploadOutlined, DownloadOutlined,
} from '@ant-design/icons';
import { machineryApi } from '../localStorageApi';

const { Text } = Typography;
const { TextArea } = Input;

const RED = 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
const BLUE = 'linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)';

export const DEFAULT_CATEGORIES = [
    'Generators', 'Water Pumps', 'Welding Machines', 'Concrete Mixers',
    'Grass & Brush Cutters', 'Air Compressors', 'Pressure Washers', 'Chainsaws',
    'Power Tools', 'Plate Compactors', 'Drilling Machines', 'Other',
];
const CONDITIONS = ['New', 'Used', 'Refurbished'];
const STALE_DAYS = 30; // prices older than this are flagged
const LOW_STOCK = 2;

const rs = (n) => `Rs. ${Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const daysSince = (d) => (d ? Math.floor((Date.now() - new Date(d).getTime()) / 86400000) : null);
const ageLabel = (d) => {
    const n = daysSince(d);
    if (n === null) return 'never';
    if (n === 0) return 'today';
    if (n === 1) return 'yesterday';
    return `${n} days ago`;
};

const stockTag = (q) => (
    <Tag color={q === 0 ? 'red' : q <= LOW_STOCK ? 'orange' : 'green'} style={{ borderRadius: 12, fontWeight: 600 }}>
        {q === 0 ? 'Out of stock' : `${q} in stock`}
    </Tag>
);

/* Parse "model,price[,quantity]" lines (header row optional) */
export const parsePriceCsv = (text) => {
    const rows = [];
    const errors = [];
    text.split(/\r?\n/).forEach((raw, i) => {
        const line = raw.trim();
        if (!line) return;
        const cols = line.split(/[,\t]/).map((c) => c.trim().replace(/^"|"$/g, ''));
        if (i === 0 && /model/i.test(cols[0]) && /price/i.test(cols[1] || '')) return; // header
        const price = parseFloat((cols[1] || '').replace(/[^0-9.]/g, ''));
        if (!cols[0] || Number.isNaN(price)) {
            errors.push(`Line ${i + 1}: "${line}"`);
            return;
        }
        const row = { model: cols[0], price };
        if (cols[2] !== undefined && cols[2] !== '') {
            const q = parseInt(cols[2], 10);
            if (!Number.isNaN(q)) row.quantity = q;
        }
        rows.push(row);
    });
    return { rows, errors };
};

/* ─── stat card (matches Dashboard) ─── */
const StatCard = ({ icon, label, value, color, bg }) => (
    <div style={{
        background: '#fff', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center',
        gap: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', flex: '1 1 160px', minWidth: 0,
    }}>
        <div style={{
            width: 46, height: 46, borderRadius: 12, background: bg, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
            {React.cloneElement(icon, { style: { color, fontSize: 22 } })}
        </div>
        <div style={{ minWidth: 0 }}>
            <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block' }}>{label}</Text>
            <Text strong style={{ fontSize: 18, color: '#1a1a2e', lineHeight: 1.2 }}>{value}</Text>
        </div>
    </div>
);

const ModalTitle = ({ icon, text, gradient = RED }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
            width: 32, height: 32, borderRadius: 8, background: gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {React.cloneElement(icon, { style: { color: 'white' } })}
        </div>
        <span>{text}</span>
    </div>
);

function MachineryPage() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [amount, setAmount] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const [historyFor, setHistoryFor] = useState(null);
    const [history, setHistory] = useState([]);

    const [bulkOpen, setBulkOpen] = useState(false);
    const [bulkText, setBulkText] = useState('');
    const [bulkSaving, setBulkSaving] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const load = async () => {
        try {
            const res = await machineryApi.getAll();
            setMachines(res.data);
        } catch {
            message.error('Failed to load machinery');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    /* ── derived data ── */
    const categories = useMemo(() => {
        const set = new Set(DEFAULT_CATEGORIES);
        machines.forEach((m) => m.category && set.add(m.category));
        return [...set];
    }, [machines]);

    const usedCategories = useMemo(
        () => ['All', ...[...new Set(machines.map((m) => m.category))].sort()],
        [machines]
    );

    const filtered = machines.filter((m) => {
        const q = search.toLowerCase();
        const matchSearch = !q || [m.name, m.brand, m.model].some((v) => v?.toLowerCase().includes(q));
        return matchSearch && (category === 'All' || m.category === category);
    });

    const stats = useMemo(() => ({
        count: machines.length,
        value: machines.reduce((s, m) => s + Number(m.price) * m.quantity, 0),
        low: machines.filter((m) => m.quantity <= LOW_STOCK).length,
        stale: machines.filter((m) => daysSince(m.price_updated_at) >= STALE_DAYS).length,
    }), [machines]);

    /* ── actions ── */
    const changeStock = async (id, dir) => {
        try {
            if (dir > 0) await machineryApi.increase(id, amount);
            else await machineryApi.decrease(id, amount);
            message.success(dir > 0 ? 'Stock increased' : 'Stock decreased');
            load();
        } catch {
            message.error(dir > 0 ? 'Failed to increase stock' : 'Not enough stock');
        }
    };

    const remove = (m) => Modal.confirm({
        title: 'Delete Machine',
        content: `Delete "${m.name}"? Its price history will also be removed.`,
        okText: 'Delete',
        okType: 'danger',
        onOk: async () => {
            try {
                await machineryApi.delete(m.id);
                message.success('Machine deleted');
                load();
            } catch {
                message.error('Failed to delete machine');
            }
        },
    });

    const openForm = (m = null) => {
        setEditing(m);
        form.resetFields();
        form.setFieldsValue(m ? { ...m, price: Number(m.price) } : { condition: 'New', quantity: 0 });
        setFormOpen(true);
    };

    const save = async (values) => {
        try {
            if (editing) await machineryApi.update(editing.id, values);
            else await machineryApi.create(values);
            message.success(editing ? 'Machine updated' : 'Machine added');
            setFormOpen(false);
            setEditing(null);
            load();
        } catch (err) {
            message.error(err?.response?.data?.message || 'Failed to save machine');
        }
    };

    const openHistory = async (m) => {
        setHistoryFor(m);
        setHistory([]);
        try {
            const res = await machineryApi.getPriceHistory(m.id);
            setHistory(res.data);
        } catch {
            message.error('Failed to load price history');
        }
    };

    const exportCsv = () => {
        const header = 'model,price,quantity,name,brand,category';
        const esc = (v) => (v == null ? '' : /[",]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
        const lines = machines.map((m) =>
            [m.model, Number(m.price).toFixed(2), m.quantity, m.name, m.brand, m.category].map(esc).join(','));
        const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `machinery-prices-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const bulkParsed = useMemo(() => parsePriceCsv(bulkText), [bulkText]);

    const applyBulk = async () => {
        if (bulkParsed.rows.length === 0) return;
        setBulkSaving(true);
        try {
            const res = await machineryApi.bulkUpdatePrices(bulkParsed.rows, 'bulk');
            const { updated, notFound } = res.data;
            message.success(`${updated} price(s) updated`);
            if (notFound?.length) {
                Modal.warning({ title: 'Some model codes were not found', content: notFound.join(', ') });
            }
            setBulkOpen(false);
            setBulkText('');
            load();
        } catch {
            message.error('Bulk update failed');
        } finally {
            setBulkSaving(false);
        }
    };

    /* ── table (desktop) ── */
    const columns = [
        {
            title: 'Machine',
            dataIndex: 'name',
            render: (_, m) => (
                <div>
                    <Text strong>{m.name}</Text>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        {[m.brand, m.model, m.power].filter(Boolean).join(' · ')}
                    </div>
                </div>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            width: 150,
            render: (c, m) => (
                <Space size={4} wrap>
                    <Tag>{c}</Tag>
                    {m.condition !== 'New' && <Tag color="purple">{m.condition}</Tag>}
                </Space>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: 160,
            sorter: (a, b) => Number(a.price) - Number(b.price),
            render: (p, m) => {
                const stale = daysSince(m.price_updated_at) >= STALE_DAYS;
                return (
                    <div>
                        <Text strong style={{ color: '#ef4444' }}>{rs(p)}</Text>
                        <div style={{ fontSize: 11, color: stale ? '#fa8c16' : '#8c8c8c' }}>
                            {stale && <ClockCircleOutlined style={{ marginRight: 4 }} />}
                            updated {ageLabel(m.price_updated_at)}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Stock',
            dataIndex: 'quantity',
            width: 120,
            sorter: (a, b) => a.quantity - b.quantity,
            render: stockTag,
        },
        {
            title: 'Actions',
            width: 210,
            render: (_, m) => (
                <Space size="small" wrap>
                    <Tooltip title="Add stock"><Button size="small" icon={<PlusOutlined />} onClick={() => changeStock(m.id, 1)} /></Tooltip>
                    <Tooltip title="Sell / remove stock"><Button size="small" danger icon={<MinusOutlined />} onClick={() => changeStock(m.id, -1)} /></Tooltip>
                    <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} style={{ color: '#1890ff', borderColor: '#1890ff' }} onClick={() => openForm(m)} /></Tooltip>
                    <Tooltip title="Price history"><Button size="small" icon={<HistoryOutlined />} onClick={() => openHistory(m)} /></Tooltip>
                    <Tooltip title="Delete"><Button size="small" type="primary" danger icon={<DeleteOutlined />} onClick={() => remove(m)} /></Tooltip>
                </Space>
            ),
        },
    ];

    /* ── card (mobile) ── */
    const MobileCard = ({ m }) => {
        const stale = daysSince(m.price_updated_at) >= STALE_DAYS;
        const btn = (bg, border, color) => ({ borderRadius: 10, height: 40, width: 40, background: bg, borderColor: border, color });
        return (
            <Card style={{ marginBottom: 12, borderRadius: 16, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                bodyStyle={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    {m.image_url ? (
                        <img src={m.image_url} alt={m.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
                    ) : (
                        <div style={{ width: 64, height: 64, borderRadius: 12, background: '#fff1f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ToolOutlined style={{ fontSize: 26, color: '#ef4444' }} />
                        </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: 15, display: 'block' }}>{m.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                            {[m.brand, m.model, m.power].filter(Boolean).join(' · ')}
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', display: 'block' }}>{rs(m.price)}</Text>
                        <Text style={{ fontSize: 11, color: stale ? '#fa8c16' : '#8c8c8c' }}>
                            Price updated {ageLabel(m.price_updated_at)}
                        </Text>
                    </div>
                </div>
                <Space size={4} wrap style={{ marginBottom: 12 }}>
                    <Tag>{m.category}</Tag>
                    {m.condition !== 'New' && <Tag color="purple">{m.condition}</Tag>}
                    {stockTag(m.quantity)}
                </Space>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                    <Space>
                        <Button icon={<PlusOutlined />} onClick={() => changeStock(m.id, 1)} style={btn('#f6ffed', '#b7eb8f', '#52c41a')} />
                        <Button icon={<MinusOutlined />} onClick={() => changeStock(m.id, -1)} style={btn('#fff2e8', '#ffbb96', '#fa541c')} />
                    </Space>
                    <Space>
                        <Button icon={<HistoryOutlined />} onClick={() => openHistory(m)} style={btn('#f9f0ff', '#d3adf7', '#722ed1')} />
                        <Button icon={<EditOutlined />} onClick={() => openForm(m)} style={btn('#e6f7ff', '#91d5ff', '#1890ff')} />
                        <Button icon={<DeleteOutlined />} onClick={() => remove(m)} style={btn('#fff1f0', '#ffa39e', '#ff4d4f')} />
                    </Space>
                </div>
            </Card>
        );
    };

    const field = { size: 'large', style: { borderRadius: 10, width: '100%' } };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <StatCard icon={<ToolOutlined />} label="Machines" value={stats.count} color="#ef4444" bg="#fff1f0" />
                <StatCard icon={<DollarOutlined />} label="Stock value" value={`Rs. ${Math.round(stats.value).toLocaleString('en-LK')}`} color="#52c41a" bg="#f6ffed" />
                <StatCard icon={<WarningOutlined />} label={`Low stock (≤${LOW_STOCK})`} value={stats.low} color="#fa541c" bg="#fff2e8" />
                <StatCard icon={<ClockCircleOutlined />} label={`Prices > ${STALE_DAYS} days old`} value={stats.stale} color="#fa8c16" bg="#fff7e6" />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        allowClear
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Search name, brand, model"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: isMobile ? '100%' : 240, borderRadius: 10 }}
                    />
                    <Select value={category} onChange={setCategory} style={{ width: 180 }}
                        options={usedCategories.map((c) => ({ value: c, label: c === 'All' ? 'All categories' : c }))} />
                    <InputNumber min={1} value={amount} onChange={(v) => setAmount(v || 1)} addonBefore="Qty" style={{ width: 110 }} />
                </Space>
                <Space wrap>
                    <Button icon={<DownloadOutlined />} onClick={exportCsv} disabled={!machines.length} style={{ borderRadius: 10, height: 40 }}>
                        Export prices
                    </Button>
                    <Button icon={<UploadOutlined />} onClick={() => setBulkOpen(true)} style={{ borderRadius: 10, height: 40 }}>
                        Bulk price update
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}
                        style={{ borderRadius: 10, height: 40, background: RED, border: 'none', fontWeight: 600 }}>
                        Add Machine
                    </Button>
                </Space>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
            ) : filtered.length === 0 ? (
                <Card style={{ borderRadius: 16 }}>
                    <Empty description={machines.length ? 'No machines match your filters' : 'No machinery yet. Add your first machine!'} />
                </Card>
            ) : isMobile ? (
                filtered.map((m) => <MobileCard key={m.id} m={m} />)
            ) : (
                <Card style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none' }} bodyStyle={{ padding: 20 }}>
                    <Table rowKey="id" columns={columns} dataSource={filtered} scroll={{ x: 760 }}
                        pagination={{ pageSize: 10, showSizeChanger: false }} />
                </Card>
            )}

            {/* Add / Edit */}
            <Modal
                title={<ModalTitle icon={editing ? <EditOutlined /> : <PlusOutlined />} text={editing ? 'Edit Machine' : 'Add Machine'} gradient={editing ? BLUE : RED} />}
                open={formOpen}
                onCancel={() => { setFormOpen(false); setEditing(null); }}
                footer={null}
                width="95%"
                style={{ maxWidth: 560 }}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={save} style={{ marginTop: 16 }}>
                    <Form.Item name="name" label="Machine name" rules={[{ required: true }]}>
                        <Input {...field} placeholder="e.g. Petrol Generator 3.5kVA" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col xs={12}>
                            <Form.Item name="brand" label="Brand"><Input {...field} placeholder="e.g. Honda" /></Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item name="model" label="Model code" tooltip="Used to match prices in bulk updates — keep it unique">
                                <Input {...field} placeholder="e.g. EG3500" />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                                <AutoComplete {...field} options={categories.map((c) => ({ value: c }))}
                                    filterOption={(input, o) => o.value.toLowerCase().includes(input.toLowerCase())} placeholder="Pick or type" />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item name="power" label="Power / capacity"><Input {...field} placeholder="e.g. 2200W, 6.5HP" /></Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item name="price" label="Price (Rs.)" rules={[{ required: true }]}>
                                <InputNumber {...field} min={0} precision={2} />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                                <InputNumber {...field} min={0} />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item name="condition" label="Condition">
                                <Select {...field} options={CONDITIONS.map((c) => ({ value: c }))} />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item name="warranty_months" label="Warranty (months)"><InputNumber {...field} min={0} /></Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="image_url" label="Image URL"><Input {...field} placeholder="https://..." /></Form.Item>
                    <Form.Item name="description" label="Notes / description"><TextArea rows={3} style={{ borderRadius: 10 }} /></Form.Item>
                    <Button type="primary" htmlType="submit" block size="large"
                        style={{ borderRadius: 10, height: 48, background: editing ? BLUE : RED, border: 'none', fontWeight: 600 }}>
                        {editing ? 'Update Machine' : 'Add Machine'}
                    </Button>
                </Form>
            </Modal>

            {/* Price history */}
            <Modal
                title={<ModalTitle icon={<HistoryOutlined />} text={`Price history – ${historyFor?.name || ''}`} gradient={BLUE} />}
                open={!!historyFor}
                onCancel={() => setHistoryFor(null)}
                footer={null}
                width="95%"
                style={{ maxWidth: 520 }}
            >
                {history.length === 0 ? (
                    <Empty description="No price changes recorded yet" />
                ) : (
                    <Table size="small" rowKey="id" pagination={false} dataSource={history} columns={[
                        { title: 'Date', dataIndex: 'changed_at', render: (d) => new Date(d).toLocaleDateString('en-LK') },
                        { title: 'Old', dataIndex: 'old_price', render: rs },
                        { title: 'New', dataIndex: 'new_price', render: (p, r) => (
                            <Text style={{ color: Number(p) > Number(r.old_price) ? '#cf1322' : '#389e0d' }}>{rs(p)}</Text>
                        ) },
                        { title: 'Source', dataIndex: 'source', render: (s) => <Tag>{s}</Tag> },
                    ]} />
                )}
            </Modal>

            {/* Bulk price update */}
            <Modal
                title={<ModalTitle icon={<UploadOutlined />} text="Bulk price update" />}
                open={bulkOpen}
                onCancel={() => setBulkOpen(false)}
                width="95%"
                style={{ maxWidth: 600 }}
                okText={`Update ${bulkParsed.rows.length} price(s)`}
                okButtonProps={{ disabled: !bulkParsed.rows.length, loading: bulkSaving }}
                onOk={applyBulk}
            >
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                    One machine per line: <code>model,price</code> or <code>model,price,quantity</code>.
                    Paste from Excel/Google Sheets or from the exported CSV.
                </Text>
                <TextArea rows={8} value={bulkText} onChange={(e) => setBulkText(e.target.value)}
                    placeholder={'model,price,quantity\nEG3500,185000,4\nWP20X,42500'} style={{ fontFamily: 'monospace', borderRadius: 10 }} />
                <div style={{ marginTop: 8 }}>
                    <Text>{bulkParsed.rows.length} valid row(s)</Text>
                    {bulkParsed.errors.length > 0 && (
                        <Text type="danger" style={{ display: 'block', fontSize: 12 }}>
                            Skipped: {bulkParsed.errors.slice(0, 5).join('; ')}{bulkParsed.errors.length > 5 ? ' …' : ''}
                        </Text>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default MachineryPage;
