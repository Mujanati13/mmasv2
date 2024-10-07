import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    NotificationOutlined,
    TransactionOutlined,
    HomeOutlined,
    CreditCardOutlined,
    CalendarOutlined,
    ScheduleOutlined,
    SolutionOutlined,
    ReadOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
    ApartmentOutlined,
    FileTextOutlined,
    UserOutlined,
    FieldTimeOutlined,
    DollarOutlined,
    FileProtectOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Button, Card, Typography, Switch, Space, Tooltip } from 'antd';
import TablePeriod from '../components/screens/peroid';
import TableContractStaff from '../components/screens/contratStaff';
import TablePayemnt from '../components/screens/payment';
import TableStaff from '../components/screens/staff';
import { toCapitalize } from '../utils/helper';
import TableContract from '../components/screens/contarClient';
import TableAffiliation from '../components/screens/affiliation';
import TableParent from '../components/screens/parents';
import TableStudent from '../components/screens/students';
import TableReservation from '../components/screens/reservations';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('dashboard');
    const [openKeys, setOpenKeys] = useState(['gestionEtablissement']);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const token = localStorage.getItem("jwtToken");
            if (token == null) {
                navigate("/");
            }
        };
        handleLogout();
    }, [navigate]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: 'gestionEtablissement',
            icon: <HomeOutlined />,
            label: 'Gestion Etablissement',
            children: [
                { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
                { key: 'notification', icon: <NotificationOutlined />, label: 'Notification' },
                { key: 'transaction', icon: <TransactionOutlined />, label: 'Transaction' },
                { key: 'salle', icon: <HomeOutlined />, label: 'Salle' },
                { key: 'abonnement', icon: <CreditCardOutlined />, label: 'Abonnement' },
            ],
        },
        {
            key: 'gestionPlanification',
            icon: <CalendarOutlined />,
            label: 'Gestion Planification',
            children: [
                { key: 'interface_reservation', icon: <ScheduleOutlined />, label: 'Reservation' },
                { key: 'seance', icon: <SolutionOutlined />, label: 'Seance' },
                { key: 'presence', icon: <TeamOutlined />, label: 'Présence' },
                { key: 'cours', icon: <ReadOutlined />, label: 'Cours' },
                { key: 'classes', icon: "", label: 'Classes' },
            ],
        },
        {
            key: 'gestionEtudiants',
            icon: <UsergroupAddOutlined />,
            label: 'Gestion des Etudiants',
            children: [
                { key: 'interface_Etudiants', icon: <UserOutlined />, label: 'Etudiants' },
                { key: 'interface_Parents', icon: <TeamOutlined />, label: 'Parents' },
                { key: 'interface_Affiliation', icon: <ApartmentOutlined />, label: 'affiliation' },
                { key: 'contrat_Etudiant', icon: <FileTextOutlined />, label: 'Contrat Etudiant' },
            ],
        },
        {
            key: 'gestionPersonnel',
            icon: <TeamOutlined />,
            label: 'Gestion du Personnel',
            children: [
                { key: 'interface_Staff', icon: <UserOutlined />, label: 'Staff' },
                { key: 'interface_Periode', icon: <FieldTimeOutlined />, label: 'Période' },
                { key: 'interface_Payement', icon: <DollarOutlined />, label: 'Payement' },
                { key: 'Contrat_Salarier', icon: <FileProtectOutlined />, label: 'Contrat salarier' },
            ],
        },
    ];

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (latestOpenKey && menuItems.map(item => item.key).indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case 'dashboard':
                return (
                    <Card title="Dashboard Overview" bordered={false}>
                        <p>Welcome to your dashboard. Here you can see an overview of your establishment.</p>
                    </Card>
                );
            case 'notification':
                return (
                    <Card title="Notifications" bordered={false}>
                        <p>You have no new notifications.</p>
                    </Card>
                );
            case 'transaction':
                return (
                    <Card title="Recent Transactions" bordered={false}>
                        <p>No recent transactions to display.</p>
                    </Card>
                );
            case 'salle':
                return (
                    <Card title="Room Management" bordered={false}>
                        <p>Manage your establishment's rooms here.</p>
                    </Card>
                );
            case 'abonnement':
                return (
                    <Card title="Subscription Management" bordered={false}>
                        <p>Manage subscriptions and plans here.</p>
                    </Card>
                );
            case 'interface_reservation':
                return (
                   <TableReservation />
                );
            case 'seance':
                return (
                    <Card title="Sessions" bordered={false}>
                        <p>Manage your sessions and classes here.</p>
                    </Card>
                );
            case 'presence':
                return (
                    <Card title="Attendance" bordered={false}>
                        <p>Track and manage student attendance here.</p>
                    </Card>
                );
            case 'cours':
                return (
                    <Card title="Courses" bordered={false}>
                        <p>Manage your course offerings here.</p>
                    </Card>
                );
            case 'classes':
                return (
                    <Card title="Classes" bordered={false}>
                        <p>View and manage your classes here.</p>
                    </Card>
                );
            case 'interface_Etudiants':
                return (
                    <TableStudent darkmode={isDarkMode} />
                );
            case 'interface_Parents':
                return (
                    <TableParent  darkmode={isDarkMode}/>
                );
            case 'interface_Affiliation':
                return (
                    <TableAffiliation darkmode={isDarkMode} />
                );
            case 'contrat_Etudiant':
                return (
                    <TableContract  darkmode={isDarkMode}/>
                );
            case 'interface_Staff':
                return (
                    <TableStaff  darkmode={isDarkMode}/>
                );
            case 'interface_Periode':
                return (
                    <TablePeriod  darkmode={isDarkMode}/>
                );
            case 'interface_Payement':
                return (
                    <TablePayemnt darkmode={isDarkMode}/>
                );
            case 'Contrat_Salarier':
                return (
                    <TableContractStaff darkmode={isDarkMode} />
                );
            default:
                return (
                    <Card title="Welcome" bordered={false}>
                        <p>Please select a menu item to view content.</p>
                    </Card>
                );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    };

    const toggleDarkMode = (checked) => {
        setIsDarkMode(checked);
        // Apply dark mode to the entire app
        document.body.classList.toggle('dark-mode', checked);
    };

    return (
        <Layout style={{ minHeight: '100vh' }} className={isDarkMode ? 'dark-mode' : ''}>
            <Sider
                className='shadow-sm'
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={230}
                collapsedWidth={80}
                style={{
                    backgroundColor: isDarkMode ? "#000C17" : "white",
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                {collapsed ? "" : <img style={{ margin: "14px 20px" }} width={140} src='./src/assets/logo.png' alt="Logo" />}
                <Menu
                    theme={isDarkMode ? "dark" : "light"}
                    mode="inline"
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    defaultSelectedKeys={['dashboard']}
                    className='mt-5'
                    items={menuItems}
                    onSelect={({ key }) => setSelectedMenu(key)}
                    style={{
                        fontSize: '14px',
                    }}
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 230, transition: 'margin-left 0.2s' }}>
                <Header
                    className='shadow-sm'
                    style={{
                        padding: '0 16px',
                        background: isDarkMode ? "#000C17" : "white",
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'fixed',
                        width: `calc(100% - ${collapsed ? 80 : 230}px)`,
                        zIndex: 1,
                        transition: 'width 0.2s',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className='pt-10'
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            color: isDarkMode ? "white" : "inherit",
                            paddingTop: 10,
                        }}
                    />
                    <div style={{ color: isDarkMode ? "white" : "black" }} className='text-lg'>
                        {toCapitalize(selectedMenu.split("_")[0]) + " " + selectedMenu.split("_")[1]}
                    </div>
                    <Space>
                        <Tooltip title="🌙/☀️ Mode">
                            <Switch
                                checkedChildren="🌙"
                                unCheckedChildren="☀️"
                                checked={isDarkMode}
                                onChange={toggleDarkMode}
                            />
                        </Tooltip>
                        <Tooltip title="Déconnecté">
                            <Button
                                danger={true}
                                type="text"
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                                style={{
                                    fontSize: '16px',
                                    color: isDarkMode ? "white" : "#000C17"
                                }}
                            />
                        </Tooltip>
                    </Space>
                </Header>
                <Content
                    className={isDarkMode ? "bg-slate-800" : ""}
                    style={{
                        // margin: '64px 16px 16px',
                        padding: '64px 16px 16px 26px',
                        minHeight: 280,
                        // background: isDarkMode ? "#000C17" : "white",
                        overflow: 'initial',
                    }}
                >

                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;