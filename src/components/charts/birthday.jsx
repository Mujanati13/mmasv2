import React, { useEffect, useState } from "react";
import { Button, Divider, Tooltip, Modal, Form, Input } from "antd";
import { BarsOutlined } from "@ant-design/icons";

function Birthday() {
  const [soonBirthdayClients, setSoonBirthdayClients] = useState([]);
  const [displayAll, setDisplayAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchBirthdayData = async () => {
      try {
        const response = await fetch(
          "https://jyssrmmas.pythonanywhere.com/api/clients/age/",
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
        setSoonBirthdayClients(data.soon_birthday_clients);
      } catch (error) {
        console.error("Failed to fetch birthday data:", error);
      }
    };

    fetchBirthdayData();
  }, []);

  const handleViewAll = () => {
    setDisplayAll(true);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Message sent:", values);
      form.resetFields();
      setModalVisible(false);
    });
  };

  return (
    <div className="w-[53%] h-96 overflow-auto bg-white shadow-sm rounded-md pl-4 pr-4 pb-4 pt-4 border border-red-50 bottom-1">
      <div className="flex items-center justify-between">
        <div className="font-medium">Clients à fêter</div>
        {!displayAll && (
          <Button
            type="primary"
            className="font-medium text-sm"
            onClick={handleViewAll}
          >
            Voir tout
          </Button>
        )}
      </div>
      <div className="mt-5">
        {soonBirthdayClients
          .slice(0, displayAll ? soonBirthdayClients.length : 4)
          .map((client) => (
            <div key={client.id_client}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">{`${client.nom_client} ${client.prenom_client}`}</div>
                  <div className="flex items-center space-x-2">
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/color-glass/48/birthday.png"
                      alt="birthday"
                    />
                    <span className="text-sm">{client.date_naissance}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-5">
                  <Tooltip title="Envoyer">
                    <div onClick={showModal}>
                      <img
                        className="cursor-pointer"
                        width="20"
                        height="20"
                        src="https://img.icons8.com/cotton/64/inbox-1.png"
                        alt="inbox-1"
                      />
                    </div>
                  </Tooltip>
                  <div className="bg-green-200 text-green-600 font-medium rounded-lg w-6 h-6 text-sm text-center">
                    {client.days_left}
                  </div>
                </div>
              </div>
              <Divider />
            </div>
          ))}
      </div>
      <Modal
        title="Envoyer un message"
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: "Please enter your message" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Birthday;
