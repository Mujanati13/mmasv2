import React, { useState, useEffect } from "react";
import { DatePicker, Spin, Alert } from "antd";
import { CalendarOutlined, ToolOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

function Reservations() {
  const [reservations, setReservations] = useState({ seances: 0, services: 0 });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, [dateRange]);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "https://jyssrmmas.pythonanywhere.com/api/number-of-reservations/";
      if (dateRange) {
        url;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReservations(data.seance_count);
      } else {
        throw new Error("Échec de récupération des réservations");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      setError("Une erreur est survenue lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[20%] max-w-md bg-white shadow-sm rounded-md p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="h-10 w-10 rounded-full bg-orange-200 flex justify-center items-center">
          <CalendarOutlined className="text-lg" />
        </div>
        <div className="font-medium">Séances</div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-md w-full">
            <CalendarOutlined className="text-2xl text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{reservations&&reservations}</div>
            <div className="text-sm text-gray-500">Séances</div>
          </div>
        </div>
      )}

      {dateRange && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Réservations du {dateRange[0].format('D MMMM YYYY')} au {dateRange[1].format('D MMMM YYYY')}
        </div>
      )}
    </div>
  );
}

export default Reservations;