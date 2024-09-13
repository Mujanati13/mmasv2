import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { DatePicker, Spin, Card } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const DemoDualAxes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, 'month'),
    moment(),
  ]);

  const authToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [start, end] = dateRange;
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/reservations/date/course/?start_date=${start.format(
          'YYYY-MM-DD'
        )}&end_date=${end.format('YYYY-MM-DD')}`,
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
      Object.entries(courses).map(([course, value]) => ({
        date,
        course,
        value
      }))
    );
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
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
    <Card title="Daily Activity Chart" extra={
      <RangePicker
        value={dateRange}
        onChange={handleDateRangeChange}
      />
    }>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Line {...config} />
      )}
    </Card>
  );
};

export default DemoDualAxes;