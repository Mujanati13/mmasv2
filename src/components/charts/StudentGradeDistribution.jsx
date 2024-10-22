import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';

const StudentGradeDistribution = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://jyssrmmas.pythonanywhere.com/api/Etudiant_by_niveau/', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                const transformedData = result.labels.map((label, index) => ({
                    grade: label,
                    count: result.data[index]
                })).filter(item => item.count > 0); // Remove entries with zero count
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
        xField: 'grade',
        yField: 'count',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoRotate: false,
                autoHide: false,
                style: {
                    fontSize: 12,
                    rotate: 45,
                },
            },
        },
        meta: {
            grade: {
                alias: 'Grade Level',
            },
            count: {
                alias: 'Number of Students',
            },
        },
        color: '#1890ff',
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='w-full h-96 bg-white pt-5 pb-0'>
            <h2 className='font-medium' style={{ textAlign: 'center', marginBottom: '0px' }}>Etudiants par niveau</h2>
            <div style={{height:"22rem"}} className='h-80'>
            <Column {...config} />

            </div>
        </div>
    );
};

export default StudentGradeDistribution;