import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  message,
  Button,
  Drawer,
  Space,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  addNewTrace,
  formatDateToYearMonthDay,
  getCurrentDate,
} from "../../../utils/helper";

const TableTransication = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [update, setUpdate] = useState(null);
  const [form] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [add, setAdd] = useState(false);
  const [clients, setClients] = useState([]);
  const [idClient, setIdClient] = useState([]);
  const [ContractClient, setContractClient] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [attribut, Setattribut] = useState({
    years: "",
    month: "",
  });

  // State for room related data
  const [ClientData, setClientData] = useState({
    date: getCurrentDate(),
    Type: true,
    montant: null,
    Mode_reglement: "",
    description: "",
    id_contrat: null,
    id_admin: localStorage.getItem("data")[0].id_admin,
    client: "",
    image: "",
    admin: localStorage.getItem("data")[0].login,
    Reste: null,
    rest_pre: null,
  });

  const TransactionDetailsModal = ({ visible, onClose, transaction }) => {
    return (
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        title="Transaction Details"
      >
        <div>
          <p>Client: {transaction?.client}</p>
          <p>Date: {formatDateToYearMonthDay(transaction?.date)}</p>
          <p>Type: {transaction?.Type ? "Entrée" : "Sortie"}</p>
          <p>Montant: {transaction?.montant}</p>
          <p>Mode de règlement: {transaction?.Mode_reglement}</p>
          <p>Description: {transaction?.description}</p>
          <p>Reste: {transaction?.Reste}</p>
          {/* Add more transaction details as needed */}
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    const fecthConn = async () => {
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/contrat/?client_id=" +
            idClient,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const data = await response.json();
        if (data.data.length == 0) {
          message.warning(
            "Ce client n'a pas de contrat, veuillez en créer un pour lui"
          );
        }
        setContractClient(data.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fecthConn();
  }, [idClient]);

  const fetchClients = async () => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/client_contrat/ "
      );
      const data = await response.json();
      const seenClients = new Set();
      const uniqueData = [];

      data.data.forEach((item) => {
        if (!seenClients.has(item.id_client)) {
          seenClients.add(item.id_client);
          uniqueData.push(item);
        }
      });
      setClients(uniqueData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Validation function to check if all required fields are filled for the room form
  const isRoomFormValid = () => {
    return true;
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Function to add a new chamber
  const addClient = async () => {
    try {
      // Check if the form is valid before submitting
      if (!isRoomFormValid()) {
        message.error("Please fill in all required fields for the chamber.");
        return;
      }

      const id_staff = JSON.parse(localStorage.getItem("data"));
      ClientData.id_admin = id_staff[0].id_employe;
      // ClientData.id_staff = ;
      // ClientData.admin = "Test";
      console.log(ClientData);
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/transactions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ClientData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.msg == "Added Successfully!!e") {
          message.success("Transition ajoutée avec succès");
          setAdd(Math.random() * 1000);
          setClientData({
            date: getCurrentDate(),
            Type: true,
            montant: null,
            Mode_reglement: "",
            description: "",
            id_contrat: null,
            id_admin: localStorage.getItem("data")[0].id_admin,
            client: "",
            image: "",
            admin: localStorage.getItem("data")[0].login,
            Reste: null,
            rest_pre: null,
          });
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_employe,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "transctions"
          );
          console.log("====================================");
          console.log(res);
          console.log("====================================");
          onCloseR();
        } else {
          message.warning(res.msg);
          console.log(res);
        }
      } else {
        console.log(response);
        message.error("Error adding chamber");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred:", error);
    }
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setClientData({
      date: getCurrentDate(),
      Type: true,
      montant: null,
      Mode_reglement: "",
      description: "",
      id_contrat: null,
      id_admin: localStorage.getItem("data")[0].id_admin,
      client: "",
      image: "",
      admin: localStorage.getItem("data")[0].login,
      Reste: null,
      rest_pre: null,
    });
  };

  // Function to handle form submission in the room drawer
  const handleRoomSubmit = () => {
    if (parseFloat(ClientData.montant) > parseFloat(ClientData.Reste)) {
      message.error("Le montant ne peut pas être supérieur au reste à payer.");
      return;
    }
    addClient();
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/transactions/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();

        // Ensure each row has a unique key
        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_tran || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData(processedData);
        setFilteredData(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = ["client", "date", "Type"];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")), // Capitalize the first letter
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "Type") {
              return (
                <a href={text} target="_blank" rel="noopener noreferrer">
                  {text == true ? "Entre" : "Sortie"}
                </a>
              );
            } else if (key === "date") {
              return <>{formatDateToYearMonthDay(text)}</>;
            }
            return text;
          },
        }));
        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update, add]);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.client.toLowerCase().startsWith(value)
    );
    setFilteredData(filtered);
  };

  // Row selection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log("selectedRowKeys changed: ", selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Disable checkbox for specific rows
    }),
  };

  // Handle edit button click
  const handleEditClick = () => {
    if (selectedRowKeys.length === 1) {
      const clientToEdit = data.find(
        (client) => client.key === selectedRowKeys[0]
      );
      setEditingClient(clientToEdit);
      form.setFieldsValue(clientToEdit);
      setIsModalVisible(true);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { PeriodeSalaire } = values;

      // Check if date_naissance is not empty
      if (!PeriodeSalaire) {
        message.error("Veuillez entrer la date de naissance");
        return;
      }

      // Add id_client to the values object

      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/coach/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const updatedClient = await response.json();
        const updatedData = data.map((client) =>
          client.key === editingClient.key ? updatedClient : client
        );
        setUpdate(updatedData);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("Client mis à jour avec succès");
        setIsModalVisible(false);
        setEditingClient(null);
        setSelectedRowKeys([]);
        // Reset the form fields
        form.resetFields();
      } else {
        message.error("Erreur lors de la mise à jour du client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      message.error("An error occurred while updating the client");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingClient(null);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const clientToDelete = data.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            `https://fithouse.pythonanywhere.com/api/periode/${clientToDelete.id_periode}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(clientToDelete),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete client with key ${key}`);
          }
        });

        await Promise.all(promises);

        const updatedData = data.filter(
          (client) => !selectedRowKeys.includes(client.key)
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        message.success(
          `${selectedRowKeys.length} client(s) supprimé(s) avec succès`
        );
      } catch (error) {
        console.error("Error deleting clients:", error);
        message.error("An error occurred while deleting clients");
      }
    }
  };

  const confirm = (e) => {
    handleDelete();
  };

  const cancel = (e) => {
    console.log(e);
  };

  return (
    <div className="w-full p-2">
      <TransactionDetailsModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-7">
          <div className="w-52">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search transaction"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-6">
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire") &&
              selectedRowKeys.length == 1 ? (
              <EyeOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedTransaction(
                    data.find((item) => item.key === selectedRowKeys[0])
                  );
                  setIsModalVisible(true);
                }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        {/* add new client  */}
        <div>
          <div className="flex items-center space-x-3">
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire") && (
                <Button
                  type="default"
                  onClick={showDrawerR}
                  icon={<UserAddOutlined />}
                >
                  Ajoute Transication
                </Button>
              )}
          </div>
          <Drawer
            title="Saisir une nouvelle transaction"
            width={720}
            onClose={onCloseR}
            closeIcon={false}
            open={open1}
            bodyStyle={{
              paddingBottom: 80,
            }}
          >
            <div>
              <div className="p-3 md:pt-0 md:pl-0 md:pr-10">
                <div className="">
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div>
                      <label htmlFor="Année" className="block font-medium">
                        *Client
                      </label>
                      <Select
                        id="ville"
                        showSearch
                        placeholder="Client"
                        className="w-full"
                        optionFilterProp="children"
                        onChange={(value, option) => {
                          setClientData({
                            ...ClientData,
                            client: option.label,
                          });
                          setIdClient(value);
                        }}
                        filterOption={(input, option) =>
                          (option?.label ?? "").startsWith(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={clients.map((cli) => {
                          return {
                            label: cli.client + " " + cli.Prenom_client,
                            value: cli.id_client,
                          };
                        })}
                      />
                    </div>
                    <div>
                      <label htmlFor="Année" className="block font-medium">
                        *Contrat
                      </label>
                      <Select
                        id="ville"
                        disabled={
                          ContractClient && ContractClient.length > 0
                            ? false
                            : true
                        }
                        showSearch
                        placeholder="Contrat"
                        className="w-full"
                        optionFilterProp="children"
                        onChange={(value) => {
                          const con = ContractClient.filter(
                            (f) => f.id_contrat == value
                          );
                          console.log(con);
                          setClientData({
                            ...ClientData,
                            id_contrat: value,
                            Reste: con[0].reste,
                            rest_pre: con[0].reste,
                          });
                        }}
                        filterOption={(input, option) =>
                          (option?.label ?? "").startsWith(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={ContractClient.map((cli) => {
                          return {
                            label: cli.abonnement + "-" + cli.cat_abn,
                            value: cli.id_contrat,
                          };
                        })}
                      />
                    </div>
                    <div>
                      <div>Le rest Precedant</div>
                      <Input
                        value={ClientData.rest_pre}
                        onChange={(v) => {
                          setClientData({
                            ...ClientData,
                            Reste: v.target.value,
                          });
                        }}
                        placeholder="Le rest Precedant"
                        type="number"
                      ></Input>
                    </div>
                    <div>
                      <div>Montant</div>
                      <Input
                        value={ClientData.montant}
                        onChange={(v) => {
                          const newMontant = parseFloat(v.target.value);
                          if (newMontant > parseFloat(ClientData.Reste)) {
                            message.warning(
                              "Le montant ne peut pas dépasser le reste à payer."
                            );
                            return;
                          }
                          setClientData({
                            ...ClientData,
                            montant: v.target.value,
                          });
                        }}
                        placeholder="Montant"
                        type="number"
                      />
                    </div>
                    <div>
                      <div>Le rest actuel</div>
                      <Input
                        value={ClientData.Reste - ClientData.montant}
                        onChange={(v) => {
                          setClientData({
                            ...ClientData,
                            Reste: v.target.value,
                          });
                        }}
                        placeholder="Le rest Precedant"
                        type="number"
                      ></Input>
                    </div>
                    <div>
                      <div>Description</div>
                      <Input
                        value={ClientData.description}
                        onChange={(v) => {
                          setClientData({
                            ...ClientData,
                            description: v.target.value,
                          });
                        }}
                        placeholder="Description"
                      ></Input>
                    </div>
                    <div>
                      <label htmlFor="Année" className="block font-medium">
                        *Mode de Reglement
                      </label>
                      <Select
                        id="ville"
                        value={ClientData.Mode_reglement}
                        showSearch
                        placeholder="Contrat"
                        className="w-full"
                        optionFilterProp="children"
                        onChange={(value) =>
                          setClientData({
                            ...ClientData,
                            Mode_reglement: value,
                          })
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "").startsWith(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={[
                          {
                            label: "Cheques",
                            value: "Cheques",
                          },
                          {
                            label: "Especes",
                            value: "Especes",
                          },
                          {
                            label: "Prelevements",
                            value: "Prelevements",
                          },
                          {
                            label: "Autres",
                            value: "autres",
                          },
                        ]}
                      />
                    </div>
                    <div>
                      <label htmlFor="Année" className="block font-medium">
                        *Type
                      </label>
                      <Select
                        id="ville"
                        value={ClientData.Type == true ? "Entree" : "Sortie"}
                        showSearch
                        placeholder="Contrat"
                        className="w-full"
                        optionFilterProp="children"
                        onChange={(value) =>
                          setClientData({ ...ClientData, Type: value })
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "").startsWith(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        defaultValue={true}
                        defaultOpen={true}
                        options={[
                          {
                            label: "Entree",
                            value: true,
                          },
                          {
                            label: "Sortie",
                            value: false,
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <Space className="mt-10">
                  <Button danger onClick={onCloseR}>
                    Annuler
                  </Button>
                  <Button onClick={handleRoomSubmit} type="default">
                    Enregistrer
                  </Button>
                </Space>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
      <Table
        loading={loading}
        pagination={{
          pageSize: 7,
          showQuickJumper: true,
        }}
        size="small"
        className="w-full mt-5"
        columns={columns}
        dataSource={filteredData}
        rowSelection={rowSelection}
      />
      {/* <Modal
        title="Edit Coach"
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
      >
        <div className="h-96 overflow-y-auto">
          <Form form={form} layout="vertical">
            <Form.Item name="mois" label="mois">
              <Input
                type="date"
                disabled
                rules={[{ required: true, message: "mois" }]}
              />
            </Form.Item>
            <Form.Item name="Année" label="Année">
              <Input
                type="date"
                disabled
                rules={[{ required: true, message: "Année" }]}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal> */}
    </div>
  );
};

export default TableTransication;
