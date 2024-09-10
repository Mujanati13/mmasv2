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
  Progress,
  Tooltip,
  Image,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { addNewTrace, getCurrentDate } from "../../../utils/helper";
import { render } from "react-dom";

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
  const [imagePath, setimagePath] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState(null);

  // State for service related data
  const [serviceData, setServiceData] = useState({
    service: "",
    Tarif: 0,
    description: "",
    duree:null,
    photo: imagePath,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name ||
        (file.url ? file.url.substring(file.url.lastIndexOf("/") + 1) : "")
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleUploadImage = async () => {
    if (fileList.length === 0) {
      return null;
    }

    const file = fileList[0];
    const formData = new FormData();
    formData.append("uploadedFile", file.originFileObj);
    formData.append("path", "services/");

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://fithouse.pythonanywhere.com/api/saveImage/",
        true
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setimagePath(res.path);
          serviceData.photo = res.path;
          setIsUploading(false);
          message.success("Image uploaded successfully");
          return res.path;
        } else {
          throw new Error("Upload failed");
        }
      };

      xhr.onerror = () => {
        throw new Error("Upload failed");
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error during file upload:", error);
      message.error("File upload failed");
      setIsUploading(false);
      return null;
    }
  };

  // Validation function to check if all required fields are filled for the service form
  const isServiceFormValid = () => {
    console.log(serviceData.service.length, serviceData.Tarif);

    return serviceData.service.length != 0 && serviceData.Tarif.length != 0;
  };

  // Function to add a new service
  const addService = async () => {
    try {
      if (!isServiceFormValid()) {
        message.warning("Veuillez remplir tous les champs requis");
        return;
      }
      await handleUploadImage();
      // Update the serviceData with the new image path
      const updatedServiceData = {
        ...serviceData,
        photo: imagePath,
      };

      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/service/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedServiceData),
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
    setFileList([]);
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
          {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (text, record) => (
              <Tooltip title="Voir les détails">
                <EyeOutlined
                  onClick={() => {
                    setSelectedServices(record);
                    setIsDetailsModalVisible(true);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            ),
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

  const handleDetailsModalCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedServices(null);
  };

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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setServiceData({ ...serviceData, [name]: value });
  };

  const handleTarifChange = (value) => {
    setServiceData({ ...serviceData, Tarif: value });
  };

  return (
    <div className="w-full p-2">
      <Modal
        title="Détails du Service"
        visible={isDetailsModalVisible}
        onCancel={handleDetailsModalCancel}
        footer={null}
        width={600}
      >
        {selectedServices && (
          <Table
            columns={[
              {
                title: "Champ",
                dataIndex: "field",
                key: "field",
                width: "40%",
              },
              { title: "Valeur", dataIndex: "value", key: "value" },
            ]}
            dataSource={[
              {
                key: "1",
                field: "Nom de Service",
                value: selectedServices.service,
              },
              {
                key: "2",
                field: "Tarif",
                value: `${selectedServices.Tarif}`,
              },
              {
                key: "3",
                field: "Description",
                value: selectedServices.description,
              },
              {
                key: "4",
                field: "Image",
                value: (
                  <Image
                    src={
                      "https://fithouse.pythonanywhere.com/media/" +
                      selectedServices.photo
                    }
                  ></Image>
                ),
              },
            ]}
            pagination={false}
            size="small"
            bordered
          />
        )}
      </Modal>
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
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {isUploading && (
              <Progress percent={Math.round(uploadProgress)} status="active" />
            )}
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                  alignContent: "center",
                  alignItems: "center",
                }}
                src={previewImage}
              />
            </Modal>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="service" className="block mb-1">
                  Nom du service
                </label>
                <Input
                  id="service"
                  name="service"
                  value={serviceData.service}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom du service"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="Tarif" className="block mb-1">
                  Tarif
                </label>
                <InputNumber
                  id="Tarif"
                  name="Tarif"
                  value={serviceData.Tarif}
                  onChange={handleTarifChange}
                  min={0}
                  step={0.01}
                  formatter={(value) => `${value} MAD`}
                  parser={(value) => value.replace(" MAD", "")}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block mb-1">
                  la duree
                </label>
                <Input
                  id="duree"
                  name="duree"
                  value={serviceData.duree}
                  onChange={handleInputChange}
                  placeholder="Entrez la duree du service (minutes)"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <Input.TextArea
                  id="description"
                  name="description"
                  value={serviceData.description}
                  onChange={handleInputChange}
                  placeholder="Entrez la description du service"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block mb-1">
                  Durée servie
                </label>
                <Select
                  style={{ width: "100%", marginBottom: "1rem" }}
                  placeholder="Sélectionnez la durée du service"
                  onChange={(e) => {
                    setServiceData({ ...serviceData, duree: e });
                  }}
                  options={[
                    { label: "30 minutes", value: "30" },
                    { label: "45 minutes", value: "45" },
                    { label: "1 hour", value: "60" },
                    { label: "1 hour 30 minutes", value: "90" },
                    { label: "2 hours", value: "120" },
                  ]}
                />
              </div>
              <Space className="mt-4">
                <Button onClick={onCloseR}>Annuler</Button>
                <Button onClick={handleServiceSubmit} type="primary">
                  Enregistrer
                </Button>
              </Space>
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
          <Form.Item name="photo" label="Photo">
            {/* <Image src={"https://fithouse.pythonanywhere.com/media/services/"+} /> */}
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
