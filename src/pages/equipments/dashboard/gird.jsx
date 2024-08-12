import { Button } from "antd";
import { ContainerOutlined } from "@ant-design/icons";
import React from "react";
import TypeContart from "../../../components/charts/typeContart";
import Teresorerie from "../../../components/charts/teresorerie";
import Client from "../../../components/charts/client";
import Reservations from "../../../components/charts/reservations";
import Birthday from "../../../components/charts/birthday";
import DemoDualAxes from "../../../components/charts/dudLine";
import ContratsType from "../../../components/charts/echeance";

function GridDashborad() {
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
      <div className="w-full p-5 flex flex-col space-y-2 items-start justify-between">
        {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
        "Administration" ? (
          <ContratsType />
        ) : (
          ""
        )}
        <div className="w-full h-60 mt-5"><DemoDualAxes /></div>
      </div>
    </div>
  );
}

export default GridDashborad;
