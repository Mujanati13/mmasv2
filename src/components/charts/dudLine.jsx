import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Card, DatePicker, Spin, Statistic } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const DailyActivityChart = () => {
  const [data, setData] = useState([]);
  const [totalInscriptions, setTotalInscriptions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, 'month'),
    moment()
  ]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const response = await fetch(
        `https://jyssrmmas.pythonanywhere.com/api/reservations/date/course`,
        {
          headers: {
            Authorization: localStorage.getItem('jwtToken'),
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData.data);
      setTotalInscriptions(jsonData.nb_inscription_total);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'date',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: false,
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  return (
    <Card
      title="Nombre des inscriptions par période"
    >
      <Statistic
        title="Total Inscriptions"
        value={totalInscriptions}
        style={{ marginBottom: 16 }}
      />
      {loading ? (
        <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Line {...config} />
      )}
    </Card>
  );
};

export default DailyActivityChart;