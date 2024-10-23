import React, { useEffect, useState } from "react";
import { Button, Space, Input, DatePicker, message, Table } from "antd";
const { RangePicker } = DatePicker;
import {
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DotChartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import DemoDualAxes from "./dudLine";
import ContratsType from "./echeance";

function Teresorerie() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("all");
  const [columns, setColumns] = useState([]);
  const defaultStartDate = moment().startOf("month");
  const defaultEndDate = moment().endOf("month");

  const handleDateChange = async (dates, paymentType) => {
    if (!dates || dates.length !== 2) {
      return;
    }

    const [startDate, endDate] = dates;
    setLoading(true);

    try {
      const response = await fetch(
        `https://jyssrmmas.pythonanywhere.com/api/stat/tresorerie?start_date=${startDate.format(
          "YYYY-MM-DD"
        )}&end_date=${endDate.format("YYYY-MM-DD")}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      message.error("Échec de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDateChange([defaultStartDate, defaultEndDate], paymentType);
  }, [paymentType]);

  function getSorter(key) {
    if (key === "nom_complet") {
      return (a, b) => a[key].localeCompare(b[key]);
    }
    if (key === "date_recrutement") {
      return (a, b) => new Date(a[key]) - new Date(b[key]);
    }
    return null;
  }

  function getColumnTitle(key) {
    const titles = {
      nom_complet: "Nom complet",
      fonction: "Fonction",
      tel: "Téléphone",
      mail: "Mail",
      date_recrutement: "Date de recrutement",
      actions: "Actions",
    };
    return titles[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }
  function getFilters(data, key) {
    const uniqueValues = [...new Set(data.map((item) => item[key]))];
    return uniqueValues.map((value) => ({ text: value, value }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
      try {
        const response = await fetch(
          "https://JyssrMmas.pythonanywhere.com/api/staff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const jsonData = await response.json();

        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_coach || index,
          nom_complet: `${item.prenom} ${item.nom}`,
        }));

        const desiredKeys = [
          "nom_complet",
          "fonction",
          "tel",
          "actions",
        ];

        const generatedColumns = desiredKeys.map((key) => {
          const columnConfig = {
            title: getColumnTitle(key),
            dataIndex: key,
            key,
            sorter: getSorter(key),
            // render: getRender(key),
          };

          // Add filters for specific columns
          if (["nom_complet", "fonction"].includes(key)) {
            columnConfig.filters = getFilters(processedData, key);
            columnConfig.onFilter = (value, record) =>
              record[key].indexOf(value) === 0;
          }

          return columnConfig;
        });

        setColumns(generatedColumns);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[55%] h-60 bg-white shadow-sm rounded-md p-4">
      {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
      "Administration" ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Trésorerie</div>
            <Space>
              <RangePicker
                onChange={(dates) => handleDateChange(dates, paymentType)}
              />
            </Space>
          </div>
          <div className="w-full mt-5 flex items-center justify-between">
            <div className="w-40 h-40 bg-green-50 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-green-200 flex justify-center ">
                  <BarChartOutlined />
                </div>
                <div className="text-sm font-normal">Recette</div>
              </div>
              <div className="font-medium mt-5">
                {data ? (
                  true ? (
                    `${data.solde_recette} MAD`
                  ) : (
                    <div className="text-sm">
                      Vous n'avez pas la permission de voir ceci
                    </div>
                  )
                ) : (
                  "Chargement..."
                )}
              </div>
            </div>
            <div className="w-40 h-40 bg-red-50 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-red-200 flex justify-center ">
                  <DotChartOutlined />
                </div>
                <div className="text-sm font-normal">Dépenses</div>
              </div>
              <div className="font-medium mt-5">
                {data ? (
                  true ? (
                    `${data.solde_depense} MAD`
                  ) : (
                    <div className="text-sm">
                      Vous n'avez pas la permission de voir ceci
                    </div>
                  )
                ) : (
                  "Chargement..."
                )}
              </div>
            </div>
            <div className="w-40 h-40 bg-purple-50 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-purple-200 flex justify-center ">
                  <LineChartOutlined />
                </div>
                <div className="text-sm font-normal">Solde période</div>
              </div>
              <div className="font-medium mt-5">
                {data ? (
                  true ? (
                    `${data.solde_peroid} MAD`
                  ) : (
                    <div className="text-sm">
                      Vous n'avez pas la permission de voir ceci
                    </div>
                  )
                ) : (
                  "Chargement..."
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Table
          pagination={{
            pageSize: 7,
            showQuickJumper: true,
          }}
          size="small"
          className="w-full mt-5"
          columns={columns}
        />
      )}
    </div>
  );
}

export default Teresorerie;
