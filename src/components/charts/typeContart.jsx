import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";

const TypeContract = () => {
  const [data, setData] = useState([]);
  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jyssrmmas.pythonanywhere.com/api/clients/contracts/type/",
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
        // Combine labels and data, filter out zero values
        const combinedData = result.labels
          .map((label, index) => ({
            type: label,
            value: result.data[index]
          }))
          .filter(item => item.value > 0);

        setData(combinedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'Contract Type',
      },
      value: {
        alias: 'Number of Contracts',
      },
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <h5 style={{ marginTop: 16 }}>{title}</h5>
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.name}
                    style={{
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        marginRight: 8,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: color,
                      }}
                    />
                    {name}: {value} contracts
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '90%' }}>
      <Column {...config} />
    </div>
  );
};

export default TypeContract;