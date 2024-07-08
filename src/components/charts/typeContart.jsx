import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";

const TypeContart = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/clients/contracts/type/",
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result.data);
        setLabels(result.labels);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const config = {
    appendPadding: 20,
    data: data.map((value, index) => ({ value, type: labels[index] })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
      style: {
        fontSize: 16,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: {
        style: {
          fontSize: '24px',
          lineHeight: '32px',
        },
        content: 'Contract Types',
      },
      content: {
        style: {
          fontSize: '20px',
        },
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        style: {
          fontSize: 14,
        },
      },
    },
    height: 350,
    width: 350,
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',  // This ensures the container takes full viewport height
    }}>
      <Pie {...config} />
    </div>
  );
};

export default TypeContart;