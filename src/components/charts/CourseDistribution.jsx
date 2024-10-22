import React, { useState, useEffect } from 'react';
import { Bar } from '@ant-design/plots';

const CourseDistribution = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://jyssrmmas.pythonanywhere.com/api/cours_by_etud/', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                const transformedData = result.labels.map((label, index) => ({
                    course: label,
                    students: result.data[index]
                })).filter(item => item.students > 0); // Remove entries with zero students
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
        data,
        xField: 'students',
        yField: 'course',
        seriesField: 'course',
        legend: { position: 'top' },
        xAxis: {
            label: {
                formatter: (v) => `${v} students`,
            },
        },
        yAxis: {
            label: {
                autoRotate: false,
            },
        },
        label: {
            position: 'right',
            offset: 4,
        },
        barBackground: {
            style: {
                fill: 'rgba(0,0,0,0.1)',
            },
        },
        interactions: [
            {
                type: 'active-region',
                enable: false,
            },
        ],
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='w-full h-80 bg-white pt-5 pb-5'>
            <h2 className='font-medium' style={{ textAlign: 'center', marginBottom: '20px' }}>Cours par etudiant</h2>
            <div className='w-full h-60'>
                <Bar {...config} />
            </div>
        </div>
    );
};

export default CourseDistribution;