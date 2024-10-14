import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';

const SalaryContractChart = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://jyssrmmas.pythonanywhere.com/api/Salarie_by_contrat/', {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                const transformedData = result.labels.map((label, index) => ({
                    type: label,
                    value: result.data[index]
                }));
                setData(transformedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='w-96 h-96 bg-white pt-5 pb-10'>
            <h2 className='font-medium' style={{ textAlign: 'center', marginBottom: '10px' }}>Contrat salaries</h2>
            <div className='w-full h-80'>
                <Pie {...config} />
            </div>
        </div>
    );
};

export default SalaryContractChart;