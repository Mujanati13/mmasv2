import React, { useEffect, useState } from "react";
import { Button, Divider, Segmented, Tooltip, Modal, Popover } from "antd";
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const ContratsType = () => {
  const [expiringContracts, setExpiringContracts] = useState({});
  const [soonExpiringContracts, setSoonExpiringContracts] = useState({});
  const [displayExpired, setDisplayExpired] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/clients/contracts/expiring/",
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setExpiringContracts(data.expiring_contracts);
        setSoonExpiringContracts(data.soon_expiring_contracts);
      } catch (error) {
        console.error("Failed to fetch contract data:", error);
      }
    };

    fetchContractData();
  }, []);

  const handleToggleDisplay = (value) => {
    setDisplayExpired(value === "Expirés");
  };

  const showModal = (clientName) => {
    setSelectedClient(clientName);
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="w-full overflow-auto overflow-ellipsis h-60 bg-white shadow-sm rounded-md pl-4 pr-4 pb-4 pt-4 border border-red-50 bottom-1">
      <div className="font-medium">Contrats à échéance</div>
      <div className="mt-4 flex justify-center">
        <Segmented
          default="Bientôt expirés"
          defaultValue="Bientôt expirés"
          defaultChecked="Bientôt expirés"
          options={[
            {
              label: "Expirés",
              value: "Expirés",
            },
            {
              label: "Bientôt expirés",
              value: "Bientôt expirés",
            },
          ]}
          onChange={handleToggleDisplay}
        />
      </div>
      <div className="mt-7">
        {displayExpired
          ? Object.entries(expiringContracts).map(([clientName, contracts]) => (
              <div key={clientName}>
                {contracts.map((contract, index) => (
                  <div
                    key={`${clientName}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/color/48/expired.png"
                        alt="expired"
                      />
                      <div>
                        <div className="text-sm">{clientName}</div>
                        <span className="text-sm opacity-55">{`Contrat: ${contract.numcontrat}`}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tooltip title="Date de fin">
                        <div>
                          <ClockCircleOutlined />
                          {/* <span className="ml-1">{contract.date_fin}</span> */}
                        </div>
                      </Tooltip>
                      <Tooltip title="Expiré">
                        <ExclamationCircleOutlined
                          onClick={() => showModal(clientName)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                ))}
                <Divider />
              </div>
            ))
          : Object.entries(soonExpiringContracts).map(
              ([clientName, contracts]) => (
                <div key={clientName}>
                  {contracts.map((contract, index) => (
                    <div
                      key={`${clientName}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          width="24"
                          height="24"
                          src="https://img.icons8.com/color/48/expired.png"
                          alt="expired"
                        />
                        <div>
                          <div className="text-sm">{clientName}</div>
                          <span className="text-sm opacity-55">{`Contrat: ${contract.numcontrat}`}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tooltip title="Date de fin">
                          <div>
                            <ClockCircleOutlined />
                            {/* <span className="ml-1">{contract.date_fin}</span> */}
                          </div>
                        </Tooltip>
                        <Tooltip title="Bientôt expiré">
                          {" "}
                          <ExclamationCircleOutlined
                            onClick={() => showModal(clientName)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                  <Divider />
                </div>
              )
            )}
      </div>
      <Modal
        title={`Envoyer un message à ${selectedClient}`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Contenu du message...</p>
      </Modal>
    </div>
  );
};


export default ContratsType
