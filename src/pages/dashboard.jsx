import React, { useState, useEffect } from "react";
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
  TeamOutlined,
  ReadOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  UserOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Button,
  Card,
  Typography,
  Switch,
  Space,
  Tooltip,
} from "antd";
import TablePeriod from "../components/screens/peroid";
import TableContractStaff from "../components/screens/contratStaff";
import TablePayemnt from "../components/screens/payment";
import TableStaff from "../components/screens/staff";
import { toCapitalize } from "../utils/helper";
import TableContract from "../components/screens/contarClient";
import TableAffiliation from "../components/screens/affiliation";
import TableParent from "../components/screens/parents";
import TableStudent from "../components/screens/students";
import TableReservation from "../components/screens/reservations";
import TableClasse from "../components/screens/class";
import TableAbonnement from "../components/screens/abonnement";
import TableEtablissement from "../components/screens/etab";
import TableNotification from "../components/screens/notifications";
import DashboardInterface from "../components/screens/dashboard";
import TableSalle from "../components/screens/salle";
import TableCours from "../components/screens/cours";
import TableTransication from "../components/screens/transactions";
import TableReservationCoachs from "../components/screens/presense";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["gestionPlanification"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("interface_etablissement");
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token == null) {
        navigate("/");
      }
    };
    const userData = JSON.parse(localStorage.getItem('data'));
    if (userData && userData[0] && userData[0].fonction) {
      setUserRole(userData[0].fonction);
      if(userData[0].fonction == "Prof"){
        setSelectedMenu("interface_presence")
      }
    }
    handleLogout();
  }, [navigate]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Gestion Etablissement menu - only for admin
  const gestionEtablissementMenu = {
    key: "gestionEtablissement",
    icon: <HomeOutlined />,
    label: "Gestion Etablissement",
    children: [
      {
        key: "interface_etablissement",
        icon: <HomeOutlined />,
        label: "Etablissement",
      },
      {
        key: "interface_dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
      },
      {
        key: "interface_notification",
        icon: <NotificationOutlined />,
        label: "Notification",
      },
      {
        key: "interface_transaction",
        icon: <TransactionOutlined />,
        label: "Transaction",
      },
      { 
        key: "interface_salle", 
        icon: <HomeOutlined />, 
        label: "Salle" 
      },
      {
        key: "interface_abonnement",
        icon: <CreditCardOutlined />,
        label: "Abonnement",
      },
    ],
  };

  // Modified menu items for professors
  const professorPlanificationMenu = {
    key: "gestionPlanification",
    icon: <CalendarOutlined />,
    label: "Gestion Planification",
    children: [
      {
        key: "interface_planning",
        icon: <CalendarOutlined />,
        label: "Planning",
      },
      {
        key: "interface_presence",
        icon: <TeamOutlined />,
        label: "Présence",
      },
      { 
        key: "interface_cours", 
        icon: <ReadOutlined />, 
        label: "Cours" 
      },
      { 
        key: "interface_classes", 
        icon: <BookOutlined />, 
        label: "Classes" 
      },
    ],
  };

  // Full planification menu for admin
  const adminPlanificationMenu = {
    key: "gestionPlanification",
    icon: <CalendarOutlined />,
    label: "Gestion Planification",
    children: [
      {
        key: "interface_reservation",
        icon: <CalendarOutlined />,
        label: "Planing",
      },
      // {
      //   key: "interface_seance",
      //   icon: <CalendarOutlined />,
      //   label: "Seance",
      // },
      {
        key: "interface_presence",
        icon: <TeamOutlined />,
        label: "Présence",
      },
      { 
        key: "interface_cours", 
        icon: <ReadOutlined />, 
        label: "Cours" 
      },
      { 
        key: "interface_classes", 
        icon: <BookOutlined />, 
        label: "Classes" 
      },
    ],
  };

  const studentManagementMenu = {
    key: "gestionEtudiants",
    icon: <UsergroupAddOutlined />,
    label: "Gestion des Etudiants",
    children: [
      {
        key: "interface_Etudiants",
        icon: <UserOutlined />,
        label: "Etudiants",
      },
      { 
        key: "interface_Parents", 
        icon: <TeamOutlined />, 
        label: "Parents" 
      },
      {
        key: "interface_Affiliation",
        icon: <ApartmentOutlined />,
        label: "affiliation",
      },
      {
        key: "contrat_Etudiant",
        icon: <FileTextOutlined />,
        label: "Contrat Etudiant",
      },
    ],
  };

  const personnelMenuItem = {
    key: "gestionPersonnel",
    icon: <TeamOutlined />,
    label: "Gestion du Personnel",
    children: [
      { 
        key: "interface_Staff", 
        icon: <UserOutlined />, 
        label: "Staff" 
      },
      {
        key: "interface_Periode",
        icon: <FieldTimeOutlined />,
        label: "Période",
      },
      {
        key: "interface_Payement",
        icon: <DollarOutlined />,
        label: "Payement",
      },
      {
        key: "Contrat_Salarier",
        icon: <FileProtectOutlined />,
        label: "Contrat salarier",
      },
    ],
  };

  // Determine menu items based on user role
  const menuItems = userRole === "Administration" || "Secrétaire"
    ? [gestionEtablissementMenu, adminPlanificationMenu, studentManagementMenu, personnelMenuItem]
    : userRole === "Prof"
    ? [  {
      key: "interface_presence",
      icon: <TeamOutlined />,
      label: "Présence",
    },]
    : [adminPlanificationMenu, studentManagementMenu];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (
      latestOpenKey &&
      menuItems.map((item) => item.key).indexOf(latestOpenKey) === -1
    ) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "interface_etablissement":
        return <TableEtablissement darkmode={isDarkMode} />;
      case "interface_dashboard":
        return <DashboardInterface darkmode={isDarkMode} />;
      case "interface_notification":
        return <TableNotification darkmode={isDarkMode} />;
      case "interface_transaction":
        return <TableTransication darkmode={isDarkMode} />;
      case "interface_salle":
        return <TableSalle darkmode={isDarkMode} />;
      case "interface_abonnement":
        return <TableAbonnement darkmode={isDarkMode} />;
      case "interface_reservation":
      case "interface_planning":
        return <TableReservation darkmode={isDarkMode} />;
      case "interface_presence":
        return <TableReservationCoachs darkmode={isDarkMode} />;
      case "interface_cours":
        return <TableCours darkmode={isDarkMode} />;
      case "interface_classes":
        return <TableClasse darkmode={isDarkMode} />;
      case "interface_Etudiants":
        return <TableStudent darkmode={isDarkMode} />;
      case "interface_Parents":
        return <TableParent darkmode={isDarkMode} />;
      case "interface_Affiliation":
        return <TableAffiliation darkmode={isDarkMode} />;
      case "contrat_Etudiant":
        return <TableContract darkmode={isDarkMode} />;
      case "interface_Staff":
        return <TableStaff darkmode={isDarkMode} />;
      case "interface_Periode":
        return <TablePeriod darkmode={isDarkMode} />;
      case "interface_Payement":
        return <TablePayemnt darkmode={isDarkMode} />;
      case "Contrat_Salarier":
        return <TableContractStaff darkmode={isDarkMode} />;
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
    document.body.classList.toggle("dark-mode", checked);
  };

  return (
    <Layout
      style={{ minHeight: "100vh" }}
      className={isDarkMode ? "dark-mode" : ""}
    >
      <Sider
        className="shadow-sm"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        collapsedWidth={80}
        style={{
          backgroundColor: isDarkMode ? "#000C17" : "white",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {collapsed ? (
          ""
        ) : (
          <img
            style={{ margin: "14px 20px" }}
            width={140}
            src="./src/assets/logo.png"
            alt="Logo"
          />
        )}
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          defaultSelectedKeys={["interface_planning"]}
          className="mt-5"
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
          style={{
            fontSize: "14px",
          }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 230,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          className="shadow-sm"
          style={{
            padding: "0 16px",
            background: isDarkMode ? "#000C17" : "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            width: `calc(100% - ${collapsed ? 80 : 230}px)`,
            zIndex: 1,
            transition: "width 0.2s",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="pt-10"
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: isDarkMode ? "white" : "inherit",
              paddingTop: 10,
            }}
          />
          <div
            style={{ color: isDarkMode ? "white" : "black" }}
            className="text-base font-medium"
          >
            {toCapitalize(selectedMenu.split("_")[0]) +
              " " +
              selectedMenu.split("_")[1]}
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
                  fontSize: "16px",
                  color: isDarkMode ? "white" : "#000C17",
                }}
              />
            </Tooltip>
          </Space>
        </Header>
        <Content
          className={isDarkMode ? "bg-slate-800" : ""}
          style={{
            padding: "64px 16px 16px 26px",
            minHeight: 280,
            overflow: "initial",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;