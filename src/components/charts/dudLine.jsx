import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Spin, Card } from 'antd';

const DemoDualAxes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const authToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/reservations/date/course/?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      const processedData = processData(jsonData);
      setData(processedData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (jsonData) => {
    return Object.entries(jsonData).flatMap(([date, courses]) => 
      Object.entries(courses)
        .filter(([_, value]) => value !== 0)  // Filter out zero values
        .map(([course, value]) => ({
          date,
          course,
          value
        }))
    );
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'course',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {
      position: 'top',
    },
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
      title="Daily Activity Chart" 
      extra={
        <div>
          <label htmlFor="start-date">Start Date: </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <label htmlFor="end-date"> End Date: </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      }
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <Line {...config} />
      )}
    </Card>
  );
};

export default DemoDualAxes;