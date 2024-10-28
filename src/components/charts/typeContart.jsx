import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { Spin, ConfigProvider, theme } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Endpoint } from '../../utils/endpoint';

const TypeContract = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const authToken = localStorage.getItem("jwtToken");
        const response = await fetch(
          Endpoint() + "/api/clients/contracts/type/",
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
        const combinedData = result.labels
          .map((label, index) => ({
            type: label,
            value: result.data[index],
          }))
          .filter((item) => item.value > 0);
        setData(combinedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
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
        fill: darkmode ? '#e5e7eb' : '#333333',
        opacity: 0.8,
      },
      color: ['white', '#white'],
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: darkmode ? '#e5e7eb' : '#333333',
        },
        color: ['white', '#white'],

      },
      line: {
        style: {
          stroke: darkmode ? '#4B5563' : '#D1D5DB',
        },
        color: ['white', '#white'],

      },
      grid: {
        line: {
          style: {
            stroke: darkmode ? '#374151' : '#E5E7EB',
            lineDash: [4, 4],
          },
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: darkmode ? '#e5e7eb' : '#333333',
        },
        color: ['white', '#white'],
      },
      line: {
        style: {
          stroke: darkmode ? '#4B5563' : '#D1D5DB',
        },
        color: ['white', '#white'],
      },
      grid: {
        line: {
          style: {
            stroke: darkmode ? '#374151' : '#E5E7EB',
            lineDash: [4, 4],
          },
        },
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
    color: darkmode ? '#60A5FA' : '#1890ff',
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: darkmode ? '#374151' : '#fff',
          color: darkmode ? '#e5e7eb' : '#333333',
          boxShadow: darkmode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
      customContent: (title, items) => {
        return (
          <div className={darkmode ? 'text-green-200' : 'text-green-900'}>
            <h5 className="mt-4 mb-2">{title}</h5>
            <ul className="p-0 m-0 list-none">
              {items?.map((item) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.name}
                    className="mb-1 flex items-center"
                  >
                    <span
                      className="inline-block mr-2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {name}: {value} contracts
                  </li>
                );
              })}
            </ul>
          </div>
        );
      },
    },
    theme: darkmode ? {
      backgroundColor: '#1F2937',
    } : undefined,
  };

  if (isLoading) {
    return (
      <div className={`w-full h-80 ${darkmode ? 'bg-green-800' : 'bg-white'} 
        flex items-center justify-center transition-colors duration-200`}>
        <Spin indicator={
          <LoadingOutlined style={{ fontSize: 24, color: darkmode ? '#60A5FA' : '#1890ff' }} spin />
        } />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full h-80 ${darkmode ? 'bg-green-800 text-red-400' : 'bg-white text-red-600'} 
        flex items-center justify-center p-4 text-center transition-colors duration-200`}>
        {error}
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <div className={`w-full h-80 transition-colors duration-200 rounded-lg shadow-sm
      ${darkmode ? 'bg-green-600 border border-green-600' : 'bg-white'}
      pt-5 pb-5`}
      >
        <h2 className={`font-medium text-center mb-5 transition-colors duration-200
        ${darkmode ? 'text-white' : 'text-green-900'}`}>
          Types de Contrat
        </h2>
        <div className="w-full h-60">
          <Column {...config} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TypeContract;