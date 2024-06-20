import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Button,
  Drawer,
  Space,
  Tooltip,
  Divider,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  BorderOuterOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const TableSalle = () => {
  const [data1, setData1] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKeys1, setSelectedRowKeys1] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchText1, setSearchText1] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [update, setUpdate] = useState(null);
  const [update1, setUpdate1] = useState(null);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [add, setAdd] = useState(false);
  const [add1, setAdd1] = useState(false);
  const [categories, setcategories] = useState([]);
  const [contarctStaff, setcontarctStaff] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // State for room related data
  const [ClientData, setClientData] = useState({
    id_etablissement: 19,
    id_category: null,
    capacity: null,
    image: "salles/avatar.jpg",
    nom_salle: "",
    etablissemnt: "FitHouse Complexe",
    category: "",
  });

  const [CategoireData, setCategoireData] = useState({
    nom_category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/category/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        const options = jsonData.data.map((cat) => {
          return { label: cat.nom_category, value: cat.id_category };
        });
        setcategories(options);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/contratstaff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setcontarctStaff(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Validation function to check if all required fields are filled for the room form
  const isRoomFormValid = () => {
    const { nom_cour, description, reglement, genre } = ClientData;
    if ((nom_cour, description, reglement, genre)) return true;
  };

  // Function to add a new chamber
  const addClient = async () => {
    // check in contra staf
    try {
      // Check if the form is valid before submitting
      //   if (!isRoomFormValid()) {
      //     message.error("Please fill in all required fields for the chamber.");
      //     return;
      //   }

      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/salles/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
          body: JSON.stringify(ClientData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.msg == "Added Successfully!!") {
          message.success("Cour added successfully");
          setAdd(Math.random() * 1000);
          setClientData({
            id_etablissement: 19,
            id_category: null,
            capacity: null,
            image: "salles/avatar.jpg",
            nom_salle: "",
            etablissemnt: "FitHouse Complexe",
            category: "",
          });
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

  const addCtegeries = async () => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/category/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
          body: JSON.stringify(CategoireData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res == "Added Successfully!!") {
          message.success("categorie added successfully");
          setAdd1(Math.random() * 1000);
          setCategoireData({ nom_category: "" });
          //   onCloseC();
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

  const showDrawerC = () => {
    setOpen2(true);
  };

  const onCloseC = () => {
    setOpen2(false);
    setCategoireData({
      nom_category: "",
    });
  };

  const onCloseR = () => {
    setOpen1(false);
    setClientData({
      id_etablissement: 19,
      id_category: null,
      capacity: null,
      image: "salles/avatar.jpg",
      nom_salle: "",
      etablissemnt: "FitHouse Complexe",
      category: "",
    });
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setIsViewModalVisible(true);
  };

  // Function to handle form submission in the room drawer
  const handleRoomSubmit = () => {
    addClient();
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/salles/",
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
          key: item.id_salle || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData(processedData);
        setFilteredData(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = [
          "nom_salle",
          "category",
          "capacity",
          "",
        ];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")), // Capitalize the first letter
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "description") {
              return <div>{text}</div>;
            }
            if (key === "date_inscription") {
              return <Tag>{text}</Tag>;
            }
            if (key === "") {
              return (
                <div>
                  <EyeOutlined
                    onClick={() => handleViewDetails(record)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              );
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/category/ ",
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
          key: item.id_category || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData1(processedData);
        setFilteredData1(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = ["nom_category"];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")), // Capitalize the first letter
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "description") {
              return <div>{text}</div>;
            } else if (key === "date_inscription") {
              return <Tag>{text}</Tag>;
            }
            return text;
          },
        }));
        setColumns1(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update1, add1]);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.nom_salle.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleSearch2 = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText1(value);
    const filtered = data1.filter((item) =>
      item.nom_category.toLowerCase().includes(value)
    );
    setFilteredData1(filtered);
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

  const rowSelection2 = {
    selectedRowKeys1,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys1(selectedRowKeys);
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
      console.log(values);
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/salles/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ...values,
            id_salle: editingClient.id_salle,
            id_category: editingClient.id_category,
            id_etablissement: editingClient.id_etablissement,
            category: editingClient.category,
          }),
        }
      );

      if (response.ok) {
        const updatedClient = await response.json();
        if (updatedClient.msg == "Upadated Successfully!!") {
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
          message.warning(updatedClient.msg);
        }
      } else {
        message.error("Erreur lors de la mise à jour du client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      message.error("An error occurred while updating the client");
    }
  };

  // Handle edit button click
  const handleEditClick1 = () => {
    if (selectedRowKeys1.length === 1) {
      const clientToEdit = data1.find(
        (client) => client.key === selectedRowKeys1[0]
      );
      setEditingClient(clientToEdit);
      form1.setFieldsValue(clientToEdit);
      setIsModalVisible1(true);
    }
  };

  const handleModalSubmit1 = async () => {
    try {
      const values = await form1.validateFields();
      console.log(values);
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/category/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ...values,
            id_category: editingClient.id_category,
          }),
        }
      );

      if (response.ok) {
        const updatedClient = await response.json();
        if (updatedClient == "Upadated Successfully!!") {
          const updatedData = data.map((client) =>
            client.key === editingClient.key ? updatedClient : client
          );
          setUpdate1(updatedData);
          setData1(updatedData);
          setFilteredData1(updatedData);
          message.success("Categorie mis à jour avec succès");
          setIsModalVisible1(false);
          setEditingClient(null);
          setSelectedRowKeys1([]);
          // Reset the form fields
          form1.resetFields();
        } else {
          message.warning(updatedClient.msg);
        }
      } else {
        message.error("Erreur lors de la mise à jour du categorie");
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
  const handleModalCancel1 = () => {
    setIsModalVisible1(false);
    setEditingClient(null);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const clientToDelete = data.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            `https://fithouse.pythonanywhere.com/api/salles/${clientToDelete.id_salle}`,
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
          `${selectedRowKeys.length} salle(s) supprimé(s) avec succès`
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

  const handleDelete1 = async () => {
    if (selectedRowKeys1.length >= 1) {
      try {
        const promises = selectedRowKeys1.map(async (key) => {
          const clientToDelete = data1.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            `https://fithouse.pythonanywhere.com/api/category/${clientToDelete.id_category}`,
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
            throw new Error(`Failed to delete categorie with key ${key}`);
          }
        });

        await Promise.all(promises);

        const updatedData = data1.filter(
          (client) => !selectedRowKeys1.includes(client.key)
        );
        setData1(updatedData);
        setFilteredData1(updatedData);
        setSelectedRowKeys1([]);
        message.success(
          `${selectedRowKeys1.length} Categorie(s) supprimé(s) avec succès`
        );
      } catch (error) {
        console.error("Error deleting clients:", error);
        message.error("An error occurred while deleting clients");
      }
    }
  };

  const confirm1 = (e) => {
    handleDelete1();
  };

  const cancel = (e) => {
    console.log(e);
  };

  return (
    <div className="w-full p-2">
      <Modal
        title={`Details of ${selectedRoom?.nom_salle}`}
        visible={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedRoom(null);
        }}
        footer={null}
      >
        {/* Display the details of the selected room here */}
        <p>Category: {selectedRoom?.category}</p>
        <p>Capacity: {selectedRoom?.capacity}</p>
        {/* Add other details as needed */}
      </Modal>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-7">
          <div className="w-52">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search salle"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-6">
            {selectedRowKeys.length === 1 ? (
              <EditOutlined
                className="cursor-pointer"
                onClick={handleEditClick}
              />
            ) : (
              ""
            )}
            {selectedRowKeys.length >= 1 ? (
              <Popconfirm
                title="Supprimer la salle"
                description="Êtes-vous sûr de supprimer cette salle"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Oui"
                cancelText="Non"
              >
                <DeleteOutlined className="cursor-pointer" />{" "}
              </Popconfirm>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* add new client  */}
        <div>
          <div className="flex items-center space-x-3">
            <Button
              type="default"
              onClick={showDrawerR}
              icon={<UserAddOutlined />}
            >
              Ajout salle
            </Button>
            <Button
              type="default"
              onClick={showDrawerC}
              icon={<BorderOuterOutlined />}
            >
              Ajout categorie
            </Button>
          </div>
          <Drawer
            title="Saisir un nouveau salle"
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
                      <div>*Nom Salle</div>
                      <Input
                        value={ClientData.nom_salle}
                        onChange={(value) =>
                          setClientData({
                            ...ClientData,
                            nom_salle: value.target.value,
                          })
                        }
                        placeholder="Nom salle"
                      ></Input>
                    </div>
                    <div>
                      <div>*Capacity</div>
                      <Input
                        value={ClientData.capacity}
                        onChange={(value) =>
                          setClientData({
                            ...ClientData,
                            capacity: value.target.value,
                          })
                        }
                        placeholder="Capacity"
                      ></Input>
                    </div>
                    <div>
                      <label htmlFor="Année" className="block font-medium">
                        *Categorie
                      </label>
                      <Select
                        id="categorie"
                        showSearch
                        placeholder="categorie"
                        value={ClientData.category}
                        className="w-full"
                        optionFilterProp="children"
                        onChange={(value, option) => {
                          setClientData({
                            ...ClientData,
                            id_category: value,
                            category: option.label,
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
                        options={categories}
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
          <Drawer
            title="Saisir un nouveau categorie"
            width={720}
            onClose={onCloseC}
            closeIcon={false}
            open={open2}
            bodyStyle={{
              paddingBottom: 80,
            }}
          >
            <div>
              <div className="p-3 md:pt-0 md:pl-0 md:pr-10">
                <div className="">
                  <div className="flex items-center space-x-5">
                    <div>
                      {/* <div>*Nom categorie</div> */}
                      <Input
                        value={CategoireData.nom_category}
                        onChange={(value) =>
                          setCategoireData({
                            ...CategoireData,
                            nom_category: value.target.value,
                          })
                        }
                        placeholder="Nom Categorie"
                      ></Input>
                    </div>
                    <Tooltip title="Ajoute un nouveau categorie">
                      <PlusOutlined
                        className="cursor-pointer"
                        onClick={addCtegeries}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
              <Divider />
              <div className="mt-5">
                <div className="flex items-center space-x-6">
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search salle"
                    className="w-48"
                    value={searchText1}
                    onChange={handleSearch2}
                  />
                  {selectedRowKeys1.length === 1 ? (
                    <EditOutlined
                      className="cursor-pointer"
                      onClick={handleEditClick1}
                    />
                  ) : (
                    ""
                  )}
                  {selectedRowKeys1.length >= 1 ? (
                    <Popconfirm
                      title="Delete Contrat categorie"
                      description="Are you sure to delete this categorie"
                      onConfirm={confirm1}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined className="cursor-pointer" />{" "}
                    </Popconfirm>
                  ) : (
                    ""
                  )}
                </div>
                <Table
                  loading={loading}
                  pagination={{
                    pageSize: 5,
                    showQuickJumper: true,
                  }}
                  size="small"
                  className="w-full mt-5"
                  columns={columns1}
                  dataSource={filteredData1}
                  rowSelection={rowSelection2}
                />
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
      <Modal
        title="Edit Salle"
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
      >
        <div className="h-96 overflow-y-auto">
          <Form form={form} layout="vertical">
            <Form.Item name="nom_salle" label="Nom salle">
              <Input rules={[{ required: true, message: "Nom salle" }]} />
            </Form.Item>
            <Form.Item name="capacity" label="capacity">
              <Input rules={[{ required: true, message: "capacity" }]} />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[
                { required: true, message: "Gene selection is required" },
              ]}
            >
              <Select
                id="categorie"
                showSearch
                placeholder="categorie"
                className="w-full"
                optionFilterProp="children"
                onChange={(value, option) => {
                  setEditingClient({
                    ...editingClient,
                    id_category: value,
                    category: option.label,
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
                options={categories}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Edit Categorie"
        visible={isModalVisible1}
        onOk={handleModalSubmit1}
        onCancel={handleModalCancel1}
      >
        <div className="h-96 overflow-y-auto mt-10">
          <Form form={form1} layout="vertical">
            <Form.Item name="nom_category" label="Nom categorie">
              <Input rules={[{ required: true, message: "categorie" }]} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default TableSalle;
