import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Typography,
    Space,
    message,
    Popconfirm,
    Tag,
    Statistic,
    Row,
    Col,
    Spin
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    UserOutlined,
    DollarOutlined,
    PhoneOutlined,
    TeamOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    LockOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { employeesApi } from '../localStorageApi';

const { Text, Title } = Typography;

// Security PIN for salary access (you can change this)
const SALARY_ACCESS_PIN = "1234";

const SalaryPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [salaryModalVisible, setSalaryModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [salaryAction, setSalaryAction] = useState('increase'); // 'increase' or 'decrease'
    const [submitting, setSubmitting] = useState(false);
    const [pinError, setPinError] = useState('');
    const [form] = Form.useForm();
    const [salaryForm] = Form.useForm();
    const [pinForm] = Form.useForm();

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await employeesApi.getAll();
            setEmployees(response.data);
        } catch (err) {
            message.error('Failed to load employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle PIN authentication
    const handlePinSubmit = (values) => {
        if (values.pin === SALARY_ACCESS_PIN) {
            setIsAuthenticated(true);
            setPinError('');
            fetchEmployees();
            message.success('Access granted');
        } else {
            setPinError('Incorrect PIN. Please try again.');
        }
    };

    const handleAddEmployee = () => {
        form.resetFields();
        setModalVisible(true);
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await employeesApi.delete(id);
            message.success('Employee removed successfully');
            fetchEmployees();
        } catch (err) {
            message.error('Failed to remove employee');
            console.error(err);
        }
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            await employeesApi.create(values);
            message.success('Employee added successfully');
            setModalVisible(false);
            fetchEmployees();
        } catch (err) {
            message.error('Failed to add employee');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenSalaryModal = (employee, action) => {
        setSelectedEmployee(employee);
        setSalaryAction(action);
        salaryForm.setFieldsValue({ amount: 1000 });
        setSalaryModalVisible(true);
    };

    const handleSalaryChange = async (values) => {
        if (!selectedEmployee) return;

        setSubmitting(true);
        try {
            const currentSalary = parseFloat(selectedEmployee.salary || 0);
            const amount = parseFloat(values.amount);
            let newSalary;

            if (salaryAction === 'increase') {
                newSalary = currentSalary + amount;
            } else {
                newSalary = Math.max(0, currentSalary - amount);
            }

            await employeesApi.update(selectedEmployee.id, {
                ...selectedEmployee,
                salary: newSalary
            });
            message.success(`Salary ${salaryAction === 'increase' ? 'increased' : 'decreased'} by Rs. ${values.amount.toLocaleString()}`);
            setSalaryModalVisible(false);
            fetchEmployees();
        } catch (err) {
            message.error(`Failed to ${salaryAction} salary`);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setEmployees([]);
        pinForm.resetFields();
    };

    const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Space>
                    <UserOutlined style={{ color: '#e53935' }} />
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            responsive: ['sm'],
            render: (text) => text ? <Tag color="blue">{text}</Tag> : <Text type="secondary">-</Text>
        },
        {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
            render: (salary) => (
                <Text strong style={{ color: '#52c41a' }}>
                    Rs. {parseFloat(salary || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </Text>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<ArrowUpOutlined />}
                        onClick={() => handleOpenSalaryModal(record, 'increase')}
                        style={{
                            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                            border: 'none'
                        }}
                    />
                    <Button
                        type="primary"
                        size="small"
                        icon={<ArrowDownOutlined />}
                        onClick={() => handleOpenSalaryModal(record, 'decrease')}
                        style={{
                            background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                            border: 'none'
                        }}
                    />
                    <Popconfirm
                        title="Remove Employee"
                        description="Are you sure?"
                        onConfirm={() => handleDeleteEmployee(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // Show PIN authentication screen
    if (!isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 150px)'
            }}>
                <Card
                    style={{
                        width: '100%',
                        maxWidth: '420px',
                        borderRadius: '32px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        background: '#fff'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '90px',
                            height: '90px',
                            background: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            border: '1px solid rgba(239, 68, 68, 0.1)'
                        }}>
                            <SafetyOutlined style={{ fontSize: '42px', color: '#ef4444' }} />
                        </div>
                        <Title level={2} style={{ margin: '0 0 4px', fontWeight: 800, letterSpacing: '-1px' }}>Salary Vault</Title>
                        <Text style={{ color: '#64748b', fontSize: '15px', fontWeight: 500 }}>Authorization required to view payroll</Text>
                    </div>

                    <Form
                        form={pinForm}
                        layout="vertical"
                        onFinish={handlePinSubmit}
                    >
                        <Form.Item
                            name="pin"
                            rules={[{ required: true, message: 'Please enter PIN' }]}
                            validateStatus={pinError ? 'error' : ''}
                            help={pinError}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Enter 4-digit PIN"
                                size="large"
                                maxLength={10}
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                style={{
                                    height: '50px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                    border: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                Unlock Salaries
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Default PIN: ####
                        </Text>
                    </div>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Summary Cards */}
            <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12}>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            borderRadius: '24px',
                            border: 'none',
                            boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.1), 0 10px 10px -6px rgba(79, 70, 229, 0.04)',
                            overflow: 'hidden',
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500 }}>Total Active Employees</Text>}
                            value={employees.length}
                            prefix={<TeamOutlined style={{ color: 'white', marginRight: '8px' }} />}
                            valueStyle={{ color: 'white', fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                            borderRadius: '24px',
                            border: 'none',
                            boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.1), 0 10px 10px -6px rgba(5, 150, 105, 0.04)',
                            overflow: 'hidden',
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500 }}>Total Monthly Expenditure</Text>}
                            value={totalSalary}
                            precision={2}
                            prefix={<span style={{ color: 'white', fontSize: '20px', marginRight: '4px' }}>Rs.</span>}
                            valueStyle={{ color: 'white', fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Employees Table */}
            <Card
                title={
                    <Space>
                        <DollarOutlined style={{ color: '#e53935' }} />
                        <span>Employee Salaries</span>
                    </Space>
                }
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddEmployee}
                            style={{
                                background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                        >
                            Add Employee
                        </Button>
                        <Button
                            icon={<LockOutlined />}
                            onClick={handleLogout}
                            style={{ borderRadius: '8px' }}
                        >
                            Lock
                        </Button>
                    </Space>
                }
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
            >
                <Table
                    columns={columns}
                    dataSource={employees}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 500 }}
                />
            </Card>

            {/* Add Employee Modal */}
            <Modal
                title="Add New Employee"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: '16px' }}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter name' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item name="position" label="Position">
                        <Input placeholder="e.g. Sales Associate" />
                    </Form.Item>
                    <Form.Item name="salary" label="Starting Salary (Rs.)" rules={[{ required: true, message: 'Please enter salary' }]}>
                        <InputNumber
                            placeholder="Enter salary"
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone">
                        <Input prefix={<PhoneOutlined />} placeholder="Optional" />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={submitting}
                                style={{ background: 'linear-gradient(135deg, #e53935 0%, #ff6b6b 100%)', border: 'none' }}>
                                Add Employee
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Salary Adjustment Modal */}
            <Modal
                title={`${salaryAction === 'increase' ? 'Increase' : 'Decrease'} Salary - ${selectedEmployee?.name}`}
                open={salaryModalVisible}
                onCancel={() => setSalaryModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={salaryForm} layout="vertical" onFinish={handleSalaryChange} style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                        <Text type="secondary">Current Salary: </Text>
                        <Text strong style={{ color: '#52c41a' }}>
                            Rs. {parseFloat(selectedEmployee?.salary || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </Text>
                    </div>
                    <Form.Item name="amount" label={`${salaryAction === 'increase' ? 'Increase' : 'Decrease'} Amount (Rs.)`} rules={[{ required: true, message: 'Enter amount' }]}>
                        <InputNumber
                            placeholder="Enter amount"
                            style={{ width: '100%' }}
                            min={1}
                            precision={2}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setSalaryModalVisible(false)}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={salaryAction === 'increase' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                loading={submitting}
                                style={{
                                    background: salaryAction === 'increase'
                                        ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
                                        : 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                                    border: 'none'
                                }}>
                                {salaryAction === 'increase' ? 'Increase' : 'Decrease'} Salary
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SalaryPage;
