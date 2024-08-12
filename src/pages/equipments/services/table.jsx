import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Button,
  Drawer,
  Space,
  InputNumber,
  Upload,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { addNewTrace, getCurrentDate } from "../../../utils/helper";

const TableServices = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [update, setUpdate] = useState(null);
  const [form] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [add, setAdd] = useState(false);

  // State for service related data
  const [serviceData, setServiceData] = useState({
    service: "",
    Tarif: 0,
    description: "",
    photo: "",
  });

  // Function to handle image upload
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("https://api.example.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.imageUrl; // Assuming the API returns the URL of the uploaded image
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image");
      return null;
    }
  };

  // Validation function to check if all required fields are filled for the service form
  const isServiceFormValid = () => {
    return serviceData.service && serviceData.Tarif;
  };

  // Function to add a new service
  const addService = async () => {
    try {
      if (!isServiceFormValid()) {
        message.warning("Veuillez remplir tous les champs requis");
        return;
      }
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/service/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        message.success("Service ajouté avec succès");
        setAdd(Math.random() * 1000);
        setServiceData({
          service: "",
          Tarif: 0,
          description: "",
          photo: "",
        });
        const id_staff = JSON.parse(localStorage.getItem("data"));
        await addNewTrace(
          id_staff[0].id_employe,
          "Ajout",
          getCurrentDate(),
          `${JSON.stringify(serviceData)}`,
          "service"
        );
        onCloseR();
      } else {
        message.error("Erreur lors de l'ajout du service");
      }
    } catch (error) {
      console.log(error);
      message.error("Une erreur est survenue:", error);
    }
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setServiceData({
      service: "",
      Tarif: 0,
      description: "",
      photo: "",
    });
  };

  // Function to handle form submission in the service drawer
  const handleServiceSubmit = () => {
    addService();
  };

  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/service/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const jsonData = await response.json();

        const processedData = jsonData.data.map((item) => ({
          ...item,
          key: item.ID_service,
        }));

        setData(processedData);
        setFilteredData(processedData);

        const generatedColumns = [
          {
            title: "Service",
            dataIndex: "service",
            key: "service",
          },
          {
            title: "Tarif",
            dataIndex: "Tarif",
            key: "Tarif",
            render: (text) => `${text} MAD`,
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
        ];
        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update, add]);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.service.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Row selection object
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // Handle edit button click
  const handleEditClick = () => {
    if (selectedRowKeys.length === 1) {
      const serviceToEdit = data.find(
        (service) => service.key === selectedRowKeys[0]
      );
      setEditingService(serviceToEdit);
      form.setFieldsValue(serviceToEdit);
      setIsModalVisible(true);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.ID_service = editingService.ID_service;
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/service/${editingService.ID_service}`,
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
        const updatedService = await response.json();
        const updatedData = data.map((service) =>
          service.key === editingService.key ? updatedService : service
        );
        setUpdate(updatedData);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("Service mis à jour avec succès");
        setIsModalVisible(false);
        setEditingService(null);
        setSelectedRowKeys([]);
        form.resetFields();
      } else {
        message.error("Erreur lors de la mise à jour du service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      message.error(
        "Une erreur est survenue lors de la mise à jour du service"
      );
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingService(null);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const serviceToDelete = data.find((service) => service.key === key);
          const response = await fetch(
            `https://fithouse.pythonanywhere.com/api/service/${serviceToDelete.ID_service}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete service with key ${key}`);
          }
          const id_staff = JSON.parse(localStorage.getItem("data"));
          await addNewTrace(
            id_staff[0].id_employe,
            "Supprimer",
            getCurrentDate(),
            `${JSON.stringify(serviceToDelete)}`,
            "service"
          );
        });

        await Promise.all(promises);

        const updatedData = data.filter(
          (service) => !selectedRowKeys.includes(service.key)
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        message.success(
          `${selectedRowKeys.length} service(s) supprimé(s) avec succès`
        );
      } catch (error) {
        console.error("Error deleting services:", error);
        message.error(
          "Une erreur est survenue lors de la suppression des services"
        );
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
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-7">
          <div className="w-52">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher un service"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-6">
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ===
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ===
                "secretaire") &&
            selectedRowKeys.length >= 1 ? (
              <Popconfirm
                title="Supprimer le(s) service(s)"
                description="Êtes-vous sûr de vouloir supprimer ce(s) service(s) ?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Oui"
                cancelText="Non"
              >
                <DeleteOutlined className="cursor-pointer" />
              </Popconfirm>
            ) : (
              ""
            )}
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ===
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ===
                "secretaire") &&
              selectedRowKeys.length === 1 && (
                <EditOutlined onClick={handleEditClick}></EditOutlined>
              )}
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-3">
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ===
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ===
                "secretaire") && (
              <Button
                type="default"
                onClick={showDrawerR}
                icon={<PlusOutlined />}
              >
                Ajouter un service
              </Button>
            )}
          </div>
          <Drawer
            title="Ajouter un nouveau service"
            width={720}
            onClose={onCloseR}
            open={open1}
            bodyStyle={{
              paddingBottom: 80,
            }}
          >
            <Form layout="vertical">
              <Form.Item
                name="service"
                label="Nom du service"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le nom du service",
                  },
                ]}
              >
                <Input
                  value={serviceData.service}
                  onChange={(e) =>
                    setServiceData({ ...serviceData, service: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                name="Tarif"
                label="Tarif"
                rules={[
                  { required: true, message: "Veuillez entrer le tarif" },
                ]}
              >
                <InputNumber
                  value={serviceData.Tarif}
                  onChange={(value) =>
                    setServiceData({ ...serviceData, Tarif: value })
                  }
                  min={0}
                  step={0.01}
                  formatter={(value) => `${value} MAD`}
                  parser={(value) => value.replace(" MAD", "")}
                />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea
                  value={serviceData.description}
                  onChange={(e) =>
                    setServiceData({
                      ...serviceData,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item name="photo" label="Photo">
                <Upload
                  accept="image/*"
                  beforeUpload={(file) => {
                    setServiceData({ ...serviceData, photo: { file } });
                    return false; // Prevent default upload behavior
                  }}
                ></Upload>
              </Form.Item>
              <Space>
                <Button onClick={onCloseR}>Annuler</Button>
                <Button onClick={handleServiceSubmit} type="primary">
                  Enregistrer
                </Button>
              </Space>
            </Form>
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
        title="Modifier le service"
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="service"
            label="Nom du service"
            rules={[
              { required: true, message: "Veuillez entrer le nom du service" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Tarif"
            label="Tarif"
            rules={[{ required: true, message: "Veuillez entrer le tarif" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              formatter={(value) => `${value} MAD`}
              parser={(value) => value.replace(" MAD", "")}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          {/* <Form.Item name="photo" label="Photo URL">
            <Input />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default TableServices;
