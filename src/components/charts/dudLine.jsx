import { DualAxes } from "@ant-design/plots";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker, Spin } from "antd";

const { RangePicker } = DatePicker;

const DemoDualAxes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, "month"),
    moment(),
  ]);
  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [start, end] = dateRange;
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/reservations/date/course/?start_date=${start.format(
          "YYYY-MM-DD"
        )}&end_date=${end.format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();

      const weeklyData = processData(jsonData);
      setData(weeklyData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (jsonData) => {
    const weeklyData = {};

    Object.entries(jsonData).forEach(([date, courses]) => {
      const week = moment(date).format("YYYY-[W]WW");
      if (!weeklyData[week]) {
        weeklyData[week] = { value: 0, count: 0 };
      }
      weeklyData[week].value += Object.values(courses).reduce(
        (acc, val) => acc + val,
        0
      );
      weeklyData[week].count += 1;
    });

    return Object.entries(weeklyData)
      .map(([week, { value, count }]) => ({
        year: week,
        value,
        count,
      }))
      .sort((a, b) =>
        moment(a.year, "YYYY-[W]WW").diff(moment(b.year, "YYYY-[W]WW"))
      );
  };

  const config = {
    data,
    xField: "year",
    legend: {
      position: "top",
    },
    height: 400,
    children: [
      {
        type: "line",
        yField: "value",
        smooth: true,
        style: {
          stroke: "#5B8FF9",
          lineWidth: 3,
        },
        point: {
          size: 5,
          shape: "diamond",
          style: {
            fill: "white",
            stroke: "#5B8FF9",
            lineWidth: 2,
          },
        },
        axis: {
          y: {
            title: "Total Reservations",
            style: { titleFill: "#5B8FF9" },
          },
        },
      },
      {
        type: "line",
        yField: "count",
        smooth: true,
        style: {
          stroke: "#5AD8A6",
          lineWidth: 1,
        },
        point: {
          size: 1,
          shape: "circle",
          style: {
            fill: "white",
            stroke: "#5AD8A6",
            lineWidth: 1,
          },
        },
        axis: {
          y: {
            position: "right",
            title: "Number of Courses",
            style: { titleFill: "#5AD8A6" },
          },
        },
      },
    ],
    xAxis: {
      label: {
        formatter: (v) => moment(v, "YYYY-[W]WW").format("MMM DD"),
      },
    },
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div>
      <RangePicker
        value={dateRange}
        onChange={handleDateRangeChange}
        style={{ marginBottom: 10 }}
      />
      {loading ? <Spin size="small" className="ml-3" /> : <DualAxes className="w-full" {...config} />}
    </div>
  );
};

export default DemoDualAxes;
