import React, { useState } from "react";
import { Menu, Card, Col, Row, Typography, Collapse } from "antd";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  HomeOutlined,
  ReconciliationOutlined,
  FundOutlined,
  PieChartOutlined,
  NotificationOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  LayoutOutlined,
  UserOutlined,
  ContactsOutlined,
  BookOutlined,
  FieldTimeOutlined,
  LogoutOutlined,
  CopyOutlined,
} from "@ant-design/icons";

// Import your other components
import Etablisiment from "../../../pages/screens/etablisimment";
import Client from "../../../pages/screens/client";
import Contract from "../../../pages/screens/contract";
import Reservation from "../../../pages/screens/reservation";
import Staff from "../../../pages/screens/staff";
import Coach from "../../../pages/screens/coach";
import Peroid from "../../../pages/screens/peroid";
import Payment from "../../../pages/screens/payment";
import ContractStaff from "../../../pages/screens/contractStaff";
import Cours from "../../../pages/screens/cours";
import Salle from "../../../pages/screens/salle";
import Seance from "../../../pages/screens/seance";
import Abonnement from "../../../pages/screens/abonnement";
import Transication from "../../../pages/screens/transication";
import Notification from "../../../pages/screens/notification";
import Dashboard from "../../../pages/screens/dashboard";
import Record from "../../../pages/screens/record";
import ReservationCoachs from "../../../pages/screens/reservationC";
import CoursC from "../../../pages/screens/coursC";
import SeanceCoach from "../../../pages/screens/seancC";

const { Title } = Typography;
const { Panel } = Collapse;

const menuItems = [
  { title: "Établissement", icon: <HomeOutlined />, key: "11" },
  { title: "Dashboard", icon: <PieChartOutlined fill="#4E89FF" />, key: "12" },
  { title: "Notification", icon: <NotificationOutlined />, key: "13" },
  { title: "Transactions", icon: <CreditCardOutlined />, key: "14" },
  { title: "Abonnements", icon: <AppstoreOutlined />, key: "18" },
  { title: "Séance", icon: <ClockCircleOutlined />, key: "151" },
  { title: "Salle", icon: <LayoutOutlined />, key: "152" },
  { title: "Cours", icon: <BookOutlined />, key: "153" },
  { title: "Clients", icon: <UserOutlined />, key: "21" },
  { title: "Contrats", icon: <ContactsOutlined />, key: "22" },
  { title: "Réservations", icon: <BookOutlined />, key: "23" },
  { title: "Staff", icon: <UserOutlined />, key: "31" },
  { title: "Période", icon: <FieldTimeOutlined />, key: "32" },
  { title: "Paiement", icon: <FundOutlined />, key: "33" },
  { title: "Contrat Staff", icon: <ReconciliationOutlined />, key: "35" },
  { title: "Journal des événements", icon: <CopyOutlined />, key: "41" },
];

const Home = ({ setSelectedComponent }) => {
  const handleCardClick = (key) => {
    setSelectedComponent(key);
  };

  const groupedMenuItems = [
    {
      title: "Gestion d'Établissement",
      items: menuItems.slice(0, 5),
    },
    {
      title: "Gestion des Cours",
      items: menuItems.slice(5, 9),
    },
    {
      title: "Gestion des Clients",
      items: menuItems.slice(9, 12),
    },
    {
      title: "Gestion du Personnel",
      items: menuItems.slice(12, 15),
    },
    {
      title: "Système",
      items: menuItems.slice(15),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Collapse accordion bordered={false} defaultActiveKey={['0']}>
        {groupedMenuItems.map((group, groupIndex) => (
          <Panel header={group.title} key={groupIndex}>
            <Row gutter={[16, 16]}>
              {group.items.map((item) => (
                <Col xs={24} sm={12} md={8} lg={8} key={item.key}>
                  <Card
                    hoverable
                    style={{ textAlign: "center" }}
                    onClick={() => handleCardClick(item.key)}
                  >
                    {React.cloneElement(item.icon, {
                      style: { fontSize: "25px", marginBottom: "8px" },
                    })}
                    <Title level={4}>{item.title}</Title>
                  </Card>
                </Col>
              ))}
            </Row>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

const MenuPrime = () => {
  const [selectedComponent, setSelectedComponent] = useState("100");
  const [stateOpenKeys, setStateOpenKeys] = useState(["1", "12"]);
  const navigate = useNavigate();

  const onOpenChange = (openKeys) => {
    setStateOpenKeys(openKeys);
  };

  const onClick = (e) => {
    setSelectedComponent(e.key);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "100":
        return <Home setSelectedComponent={setSelectedComponent} />;
      case "11":
        return <Etablisiment />;
      case "12":
        return <Dashboard />;
      case "13":
        return <Notification />;
      case "14":
        return <Transication />;
      case "18":
        return <Abonnement />;
      case "151":
        return <Seance />;
      case "152":
        return <Salle />;
      case "153":
        return <Cours />;
      case "21":
        return <Client />;
      case "22":
        return <Contract />;
      case "23":
        return <Reservation />;
      case "31":
        return <Staff />;
      case "32":
        return <Peroid />;
      case "33":
        return <Payment />;
      case "34":
        return <Coach />;
      case "35":
        return <ContractStaff />;
      case "41":
        return <Record />;
      case "36":
        return <ReservationCoachs />;
      case "37":
        return <CoursC />;
      case "38":
        return <SeanceCoach />;
      default:
        return <Home setSelectedComponent={setSelectedComponent} />;
    }
  };

  const menuConfig =
    JSON.parse(localStorage.getItem(`data`))[0].fonction == "Administration" ||
    JSON.parse(localStorage.getItem("data"))[0].fonction == "secretaire"
      ? [
          {
            key: "100",
            label: "Home",
            icon: <AppstoreOutlined />,
          },
          {
            key: "1",
            label: "Gestion D'Etablissement",
            icon: <HomeOutlined />,
            children: [
              {
                key: "11",
                label: "Etablissement",
                icon: <HomeOutlined />,
              },
              {
                key: "12",
                label: "Dashboard",
                icon: <PieChartOutlined />,
              },
              {
                key: "13",
                label: "Notification",
                icon: <NotificationOutlined />,
              },
              {
                key: "14",
                label: "Transactions",
                icon: <CreditCardOutlined />,
              },
              {
                key: "18",
                label: "Abonnements",
                icon: <AppstoreOutlined />,
              },
              {
                key: "15",
                label: "Gestion de cours",
                icon: <BookOutlined />,
                children: [
                  {
                    key: "151",
                    label: "Séance",
                    icon: <ClockCircleOutlined />,
                  },
                  {
                    key: "152",
                    label: "Salle",
                    icon: <LayoutOutlined />,
                  },
                  {
                    key: "153",
                    label: "Cours",
                    icon: <BookOutlined />,
                  },
                ],
              },
            ],
          },
          {
            key: "2",
            label: "Gestion des clients",
            icon: <AppstoreOutlined />,
            children: [
              {
                key: "21",
                label: "Clients",
                icon: <UserOutlined />,
              },
              {
                key: "22",
                label: "Contrats",
                icon: <ContactsOutlined />,
              },
              {
                key: "23",
                label: "Réservations",
                icon: <BookOutlined />,
              },
            ],
          },
          {
            key: "3",
            label: "Gestion du Personnel",
            icon: <UserOutlined />,
            children: [
              {
                key: "31",
                label: "Staff",
                icon: <UserOutlined />,
              },
              {
                key: "32",
                label: "Période",
                icon: <FieldTimeOutlined />,
              },
              {
                key: "33",
                label: "Paiement",
                icon: <FundOutlined />,
              },
              {
                key: "35",
                label: "Contrat Staff",
                icon: <ReconciliationOutlined />,
              },
            ],
          },
          {
            key: "41",
            label: "Journal des événement",
            icon: <CopyOutlined />,
          },
          {
            key: "40",
            label: "Deconnexion",
            icon: <LogoutOutlined />,
            onClick: () => {
              localStorage.removeItem("jwtToken");
              navigate("/");
            },
          },
        ]
      : [
          {
            key: "100",
            label: "Home",
            icon: <AppstoreOutlined />,
          },
          {
            key: "40",
            label: "Coachs",
            icon: <AppstoreOutlined />,
            children: [
              {
                key: "36",
                label: "Pointage",
                icon: <UserOutlined />,
              },
              {
                key: "37",
                label: "Cours",
                icon: <ContactsOutlined />,
              },
              {
                key: "38",
                label: "Séances",
                icon: <BookOutlined />,
              },
            ],
          },
          {
            key: "40",
            label: "Deconnexion",
            icon: <LogoutOutlined />,
            onClick: () => {
              localStorage.removeItem("jwtToken");
              navigate("/");
            },
          },
        ];

  return (
    <div className="w-full flex justify-start space-x-2">
      <Menu
        onClick={onClick}
        mode="inline"
        selectedKeys={[selectedComponent]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
        }}
        items={menuConfig}
      />
      <div className="w-full">{renderComponent()}</div>
    </div>
  );
};

export default MenuPrime;