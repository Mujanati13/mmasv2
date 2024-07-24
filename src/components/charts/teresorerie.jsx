import React, { useEffect, useState } from "react";
import { Button, Space, Input, DatePicker, message, Select } from "antd";
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
        `https://fithouse.pythonanywhere.com/api/stat/tresorerie?start_date=${startDate.format(
          "YYYY-MM-DD"
        )}&end_date=${endDate.format("YYYY-MM-DD")}&payment_type=${paymentType}`
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

  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
  };

  const hasPermission = () => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData && userData[0].fonction === "Administration";
  };

  return (
    <div className="w-[55%] h-60 bg-white shadow-sm rounded-md">
      {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
      "Administration" ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Trésorerie</div>
            <Space>
              <RangePicker 
                onChange={(dates) => handleDateChange(dates, paymentType)} 
              />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={handlePaymentTypeChange}
              >
                <Select.Option value="all">Tous</Select.Option>
                <Select.Option value="cash">Espèces</Select.Option>
                <Select.Option value="card">Carte</Select.Option>
                <Select.Option value="transfer">Virement</Select.Option>
              </Select>
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
                  hasPermission() ? (
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
                  hasPermission() ? (
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
            <div className="w-40 h-40 bg-purple-50 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-purple-200 flex justify-center ">
                  <LineChartOutlined />
                </div>
                <div className="text-sm font-normal">Solde période</div>
              </div>
              <div className="font-medium mt-5">
                {data ? (
                  hasPermission() ? (
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
          </div>
        </div>
      ) : (
        <ContratsType/>
      )}
    </div>
  );
}

export default Teresorerie;