import React, { useState } from "react";
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
import { Menu } from "antd";
import Etablisiment from "../pages/screens/etablisimment";
import Client from "../pages/screens/client";
import Contract from "../pages/screens/contract";
import Reservation from "../pages/screens/reservation";
import Staff from "../pages/screens/staff";
import Coach from "../pages/screens/coach";
import Peroid from "../pages/screens/peroid";
import Payment from "../pages/screens/payment";
import ContractStaff from "../pages/screens/contractStaff";
import Cours from "../pages/screens/cours";
import Salle from "../pages/screens/salle";
import Seance from "../pages/screens/seance";
import Abonnement from "../pages/screens/abonnement";
import Transication from "../pages/screens/transication";
import Notification from "../pages/screens/notification";
import Dashboard from "../pages/screens/dashboard";
import { useNavigate } from "react-router-dom";
import Record from "../pages/screens/record";
import ReservationCoachs from "../pages/screens/reservationC";
import CoursC from "../pages/screens/coursC";
import SeanceCoach from "../pages/screens/seancC";
const items = [
  {
    key: "1",
    label: "Gestion D'Établissement",
    icon: <HomeOutlined />,
    children: [
      {
        key: "11",
        label: "Établissement",
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
        icon: (
          <img
            width="17"
            height="17"
            src="https://img.icons8.com/ios/50/video-playlist.png"
            alt="video-playlist"
          />
        ),
      },
      {
        key: "15",
        label: "Gestion de cours",
        icon: (
          <img
            width="17"
            height="17"
            src="https://img.icons8.com/material-outlined/24/books--v2.png"
            alt="books--v2"
          />
        ),
        children: [
          {
            key: "151",
            label: "Seance",
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
            icon: (
              <img
                width="17"
                height="17"
                src="https://img.icons8.com/ios/50/book--v1.png"
                alt="book--v1"
              />
            ),
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
        label: "Reservations",
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
        label: "Peroid",
        icon: <FieldTimeOutlined />,
      },
      {
        key: "33",
        label: "Paiement",
        icon: <FundOutlined />,
      },
      {
        key: "34",
        label: "Coach",
        icon: (
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ink/48/coach.png"
            alt="coach"
          />
        ),
      },
      {
        key: "35",
        label: "Contrat Staff",
        icon: <ReconciliationOutlined />,
      },
    ],
  },
  {
    key: "40",
    label: "Deconnexion",
    icon: <LogoutOutlined />,
    style: { marginTop: "auto" }, // This will push the logout button to the bottom
  },
];

const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};
const levelKeys = getLevelKeys(items);

const MenuPrime = () => {
  const [selectedComponent, setSelectedComponent] = useState(
    JSON.parse(localStorage.getItem(`data`))[0].fonction == "Administration" ||
      JSON.parse(localStorage.getItem("data"))[0].fonction == "secretaire"
      ? "11"
      : "36"
  );
  const [stateOpenKeys, setStateOpenKeys] = useState(["1", "12"]);
  const navigate = useNavigate();
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const onClick = (e) => {
    if (e.key === "16") {
    } else {
      setSelectedComponent(e.key);
    }
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "11":
        return <Etablisiment />;
      case "12":
        return <Dashboard />;
      case "13":
        return <Notification />;
      case "15":
        return <Seance />;
      case "16":
        return <Salle />;
      case "21":
        return <Client />;
      case "22":
        return <Contract />;
      case "23":
        return <Reservation />;
      case "31":
        return <Staff />;
      case "34":
        return <Coach />;
      case "32":
        return <Peroid />;
      case "33":
        return <Payment />;
      case "35":
        return <ContractStaff />;
      case "153":
        return <Cours />;
      case "152":
        return <Salle />;
      case "151":
        return <Seance />;
      case "18":
        return <Abonnement />;
      case "14":
        return <Transication />;
      case "41":
        return <Record />;
      case "36":
        return <ReservationCoachs />;
      case "37":
        return <CoursC />;
      case "38":
        return <SeanceCoach />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex justify-start space-x-2">
      <Menu
        className=""
        onClick={onClick}
        mode="inline"
        defaultSelectedKeys={["231"]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
        }}
        items={
          JSON.parse(localStorage.getItem(`data`))[0].fonction ==
            "Administration" ||
          JSON.parse(localStorage.getItem(`data`))[0].fonction == "secretaire"
            ? [
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
                      icon: (
                        <img
                          width="17"
                          height="17"
                          src="https://img.icons8.com/ios/50/video-playlist.png"
                          alt="video-playlist"
                        />
                      ),
                    },
                    {
                      key: "15",
                      label: "Gestion de cours",
                      icon: (
                        <img
                          width="17"
                          height="17"
                          src="https://img.icons8.com/material-outlined/24/books--v2.png"
                          alt="books--v2"
                        />
                      ),
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
                          icon: (
                            <img
                              width="17"
                              height="17"
                              src="https://img.icons8.com/ios/50/book--v1.png"
                              alt="book--v1"
                            />
                          ),
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
                    // {
                    //   key: "34",
                    //   label: "Coach",
                    //   icon: (
                    //     <img
                    //       width="18"
                    //       height="18"
                    //       src="https://img.icons8.com/ink/48/coach.png"
                    //       alt="coach"
                    //     />
                    //   ),
                    // },
                    {
                      key: "35",
                      label: "Contrat Staff",
                      icon: <ReconciliationOutlined />,
                    },
                  ],
                },
                {
                  key: "41",
                  label: "Record",
                  icon: <CopyOutlined />,
                },
                {
                  key: "40",
                  label: "Deconnexion",
                  icon: <LogoutOutlined />,
                  onClick: () => {
                    localStorage.removeItem("jwtToken");
                    navigate("/");
                    console.log("Logging out");
                  },
                },
              ]
            : [
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
                    console.log("Logging out");
                  },
                },
              ]
        }
      />
      <div className="w-full">{renderComponent()}</div>
    </div>
  );
};
export default MenuPrime;
