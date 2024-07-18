import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Tag } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import MenuPrime from "../components/MenuPrim";
function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token == null) {
        navigate("/login");
      }
    };
    handleLogout();
  }, []);

  return (
    <div className="flex flex-col items-start w-full ">
      <div className="flex items-center justify-between p-4 bg-orange-10 w-full shadow-md">
        <div className="flex items-center space-x-2 ">
          <Avatar icon={<UserOutlined />} />
          <p className="font-normal text-sm"><Tag color="orange">{JSON.parse(localStorage.getItem(`data`))[0].mail}</Tag></p>
          <p className="font-normal text-sm">{JSON.parse(localStorage.getItem(`data`))[0].login}</p>
        </div>
        <div className="font-medium"><span className="text-orange-500">F</span>it<span className="text-orange-500">House</span> v2</div>
        {JSON.parse(localStorage.getItem(`data`))[0].mail?<Tag style={{fontSize:14}} color="">{JSON.parse(localStorage.getItem(`data`))[0].fonction}</Tag>:<Tag style={{fontSize:14}} color="green">Admin</Tag>}
      </div>
      <MenuPrime />
    </div>
  );
}

export default Dashboard;
