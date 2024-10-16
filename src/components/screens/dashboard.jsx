import { Button } from "antd";
import { ContainerOutlined } from "@ant-design/icons";
import React from "react";
import TypeContart from "../charts/typeContart";
import Teresorerie from "../charts/teresorerie";
import Client from "../charts/client";
import Reservations from "../charts/reservations";
import Birthday from "../charts/birthday";
import DemoDualAxes from "../charts/dudLine";
import ContratsType from "../charts/echeance";
import SalaryContractChart from "../charts/SalaryContractChart";
import StudentGradeDistribution from "../charts/StudentGradeDistribution";
import CourseAccumulationChart from "../charts/dudLine";
import CourseScatterPlot from "../charts/dudLine";
import CourseDualAxesChart from "../charts/dudLine";
import CourseRadialBarChart from "../charts/dudLine";
import CourseDataTable from "../charts/dudLine";
import DailyActivityChart from "../charts/dudLine";
import CourseDistribution from "../charts/CourseDistribution";

function DashboardInterface() {
    return (
        <div className="w-full ">
            <div className="p-5 flex items-start justify-between">
                <Teresorerie />
                <Client />
                <Reservations />
            </div>
            <div className="pl-5  pr-5 mt-0 flex items-start justify-between">
                <div className="w-[45%] h-96 bg-white shadow-sm rounded-md pl-4 pr-4 pb-4 border border-red-50 bottom-1">
                    <div className="font-normal pt-4 flex items-center space-x-2">
                        <ContainerOutlined />
                        <div>Types de contrats</div>
                    </div>
                    <TypeContart />
                </div>
                <Birthday />
            </div>
            <div className="p-5 flex items-start justify-between">
                <SalaryContractChart />
                <div className="w-10"></div>
                <StudentGradeDistribution />
            </div>
            <div className="w-full p-5 flex flex-col space-y-2 items-start justify-between">
                <div className="flex w-full">
                    <ContratsType />
                    <div className="w-5"></div>
                    <CourseDistribution />
                </div>
                <div className="w-full h-60 mt-5"><DailyActivityChart /></div>
            </div>
        </div>
    );
}

export default DashboardInterface;
