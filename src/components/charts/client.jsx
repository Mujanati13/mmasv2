import React, { useEffect, useState } from "react";
import { Button, message, Tag } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";

function Client() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);

      try {
        const response = await fetch("https://fithouse.pythonanywhere.com/api/clients/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setClientData(result.data);
        const active = result.data.filter(client => client.statut === true);
        const inactive = result.data.filter(client => client.statut === false);

        setData({...Button, active:active.length , inactive:inactive.length})
      } catch (error) {
        message.error("Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  return (
    <div className="w-[20%] h-60 bg-white shadow-sm rounded-md">
      <div className="w-full h-60 bg-white border border-red-100 bottom-1 rounded-md p-3">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-green-200 flex justify-center ">
            <UsergroupAddOutlined className="text-lg" />
          </div>
          <div className="text-sm font-medium">Client</div>
        </div>
        <div className="p-2 flex flex-col justify-center w-full">
          {loading ? (
            <div className="font-medium opacity-70 text-sm mt-5">Loading...</div>
          ) : (
            clientData && (
              <>
                <div className="font-medium opacity-70 text-sm mt-5"><Tag>Client</Tag>: {clientData.length}</div>
                <div className="font-medium opacity-70 text-sm mt-2"><Tag>Active</Tag>: {data.active}</div>
                <div className="font-medium opacity-70 text-sm mt-2"><Tag>Inactive</Tag>: {data.inactive}</div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Client;
