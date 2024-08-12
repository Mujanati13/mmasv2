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
  Upload,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined,
  PrinterOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  addNewTrace,
  getCurrentDate,
  validateEmail,
  validateMoroccanPhoneNumber,
} from "../../../utils/helper";
import * as XLSX from "xlsx";
import moment from "moment";
const TableFournisseur = () => {
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
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [imagePath, setimagePath] = useState("");
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [villes, setVilles] = useState([]);
  const [exportFilters, setExportFilters] = useState({
    statut: null, // null means all statuses
    date_inscription_start: null,
    date_inscription_end: null,
    blackliste: null, // null means both blacklisted and non-blacklisted
    date_naissance_start: null,
    date_naissance_end: null,
  });
  const [formErrors, setFormErrors] = useState({
    societe: "",
    num_ice: "",
    nom: "",
    prenom: "",
    adresse: "",
    tel: "",
    mail: "",
    cin: "",
    ville: "",
    image: imagePath,
    civilite: "",
  });
  const [ClientData, setClientData] = useState({
    societe: "",
    num_ice: "",
    nom: "",
    prenom: "",
    adresse: "",
    tel: "",
    mail: "",
    cin: "",
    ville: "",
    image: imagePath,
    civilite: "",
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
    // Check if there is a file to upload
    if (fileList.length === 0) {
      // message.error("No files to upload.");
      return;
    }

    const file = fileList[0]; // Only upload the first file
    console.log(file.originFileObj);

    const formData = new FormData();
    formData.append("uploadedFile", file.originFileObj);
    formData.append("path", "client/");

    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/saveImage/",
        {
          method: "POST",
          body: formData, // Corrected: Pass formData directly as the body
        }
      );

      if (response.ok) {
        const res = await response.json();
        setimagePath(res.path);
        ClientData.image = res.path;
      } else {
        const errorResponse = await response.json();
        message.error(`File upload failed: ${errorResponse.detail}`);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      message.error("File upload failed");
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const showExportModal = () => {
    setIsExportModalVisible(true);
  };
  const handleExport = () => {
    const filteredData = data.filter((item) => {
      // Status filter
      if (
        exportFilters.statut !== null &&
        item.statut !== exportFilters.statut
      ) {
        return false;
      }

      // Date d'inscription filter
      if (
        exportFilters.date_inscription_start &&
        new Date(item.date_inscription) <
          new Date(exportFilters.date_inscription_start)
      ) {
        return false;
      }
      if (
        exportFilters.date_inscription_end &&
        new Date(item.date_inscription) >
          new Date(exportFilters.date_inscription_end)
      ) {
        return false;
      }

      // Blackliste filter
      if (
        exportFilters.blackliste !== null &&
        item.blackliste !== exportFilters.blackliste
      ) {
        return false;
      }

      // Date de naissance filter
      if (
        exportFilters.date_naissance_start &&
        new Date(item.date_naissance) <
          new Date(exportFilters.date_naissance_start)
      ) {
        return false;
      }
      if (
        exportFilters.date_naissance_end &&
        new Date(item.date_naissance) >
          new Date(exportFilters.date_naissance_end)
      ) {
        return false;
      }

      return true;
    });

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");

    // Generate Excel File & Download
    XLSX.writeFile(wb, "clients_export.xlsx");

    setIsExportModalVisible(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setClientData({ ...ClientData, tel: value });

    if (!validateMoroccanPhoneNumber(value)) {
      setFormErrors((prev) => ({
        ...prev,
        tel: "Numéro de téléphone invalide",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, tel: "" }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setClientData({ ...ClientData, mail: value });

    if (!validateEmail(value)) {
      setFormErrors((prev) => ({ ...prev, mail: "Adresse e-mail invalide" }));
    } else {
      setFormErrors((prev) => ({ ...prev, mail: "" }));
    }
  };

  const isRoomFormValid = () => {
    const errors = {};

    if (ClientData.civilite === "") errors.civilite = true;
    if (ClientData.nom_client === "") errors.nom_client = true;
    if (ClientData.prenom_client === "") errors.prenom_client = true;
    if (ClientData.societe === "") errors.societe = true;
    // if (ClientData.adresse === "") errors.adresse = true;
    if (!validateMoroccanPhoneNumber(ClientData.tel)) errors.tel = true;
    // if (ClientData.date_naissance === "") errors.date_naissance = true;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to add a new chamber
  const addClient = async () => {
    try {
      if (!isRoomFormValid()) {
        // const firstErrorField = Object.keys(formErrors)[0];
        // const errorElement = document.getElementById(firstErrorField);
        // if (errorElement) {
        //   errorElement.focus();
        // }
        message.warning(
          "Veuillez remplir tous les champs obligatoires correctement"
        );
        return;
      }

      await handleUploadImage();

      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/fournisseur/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...ClientData,
          }),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res == "Added Successfully!!") {
          message.success("Fournisseur ajouté avec succès");
          setAdd(Math.random() * 1000);
          setClientData({
            societe: "",
            num_ice: "",
            nom: "",
            prenom: "",
            adresse: "",
            tel: "",
            mail: "",
            cin: "",
            ville: "",
            image: imagePath,
            civilite: "",
          });
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_employe,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "client"
          );
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
      societe: "",
      num_ice: "",
      nom: "",
      prenom: "",
      adresse: "",
      tel: "",
      mail: "",
      cin: "",
      ville: "",
      image: imagePath,
      civilite: "",
    });
  };

  // Function to handle form submission in the room drawer
  const handleRoomSubmit = () => {
    addClient();
  };

  const handleDetailsModalCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedClient(null);
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/fournisseur/",
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
          key: item.id_frs || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData(processedData);
        setFilteredData(processedData);

        const desiredKeys = [
          "nom",
          "prenom",
          "adresse",
          "tel",
          "mail",
          "societe",
        ];

        const generatedColumns = desiredKeys.map((key) => ({
          title: (() => {
            switch (key) {
              case "nom_complet":
                return "Nom & Prenom";
              case "tel":
                return "Téléphone";
              case "mail":
                return "Mail";
              case "adresse":
                return "Adresse";
              case "date_inscription":
                return "Date d'inscription";
              case "actions":
                return "Actions";
              default:
                return capitalizeFirstLetter(key.replace(/\_/g, " "));
            }
          })(),
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "nom_complet") {
              return `${record.nom_client} ${record.prenom_client}`;
            } else if (key === "date_inscription") {
              return <Tag>{text}</Tag>;
            } else if (key === "actions") {
              return (
                <Tooltip title="Voir les détails">
                  <EyeOutlined
                    onClick={() => {
                      setSelectedClient(record);
                      setIsDetailsModalVisible(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
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

    const fetchVilles = async () => {
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/villes/"
        );
        const data = await response.json();
        setVilles(
          data.data.map((ville) => ({
            value: ville.id_ville,
            label: ville.nom_ville,
          }))
        );
      } catch (error) {
        console.error("Error fetching villes:", error);
      }
    };

    fetchVilles();
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
      item.nom.toLowerCase().includes(value)
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
      console.log(clientToEdit);
      form.setFieldsValue(clientToEdit);
      setIsModalVisible(true);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log(values.password);

      // Add id_client to the values object
      values.id_frs = editingClient.key;

      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/fournisseur/`,
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
        message.success("Fournisseur mis à jour avec succès");
        const id_staff = JSON.parse(localStorage.getItem("data"));
        const res = await addNewTrace(
          id_staff[0].id_employe,
          "Modification",
          getCurrentDate(),
          `${JSON.stringify(changedFields)}`,
          "client"
        );
        console.log("====================================");
        console.log(res);
        console.log("====================================");
        setChangedFields([]);
        setIsFormChanged(false);
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
    setChangedFields([]);
    setIsFormChanged(false);
    setEditingClient(null);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const clientToDelete = data.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            `https://fithouse.pythonanywhere.com/api/fournisseur/${clientToDelete.id_frs}`,
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
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_employe,
            "Supprimer",
            getCurrentDate(),
            `${JSON.stringify(clientToDelete)}`,
            "client"
          );
        });

        await Promise.all(promises);

        const updatedData = data.filter(
          (client) => !selectedRowKeys.includes(client.key)
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        message.success(
          `${selectedRowKeys.length} Fournisseur(s) supprimé(s) avec succès`
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

  const handleFormChange = (changedValues, allValues) => {
    const formatFieldName = (name) => {
      return name.replace("_", " ");
    };

    setChangedFields((prevFields) => {
      const updatedFields = [...prevFields];
      Object.keys(changedValues).forEach((key) => {
        const newField = {
          name: formatFieldName(key),
          oldValue: editingClient[key], // Use editingClient instead of selectedRecord
          newValue: changedValues[key],
        };
        const existingIndex = updatedFields.findIndex(
          (field) => field.name === newField.name
        );
        if (existingIndex !== -1) {
          // Update existing field
          updatedFields[existingIndex] = newField;
        } else {
          // Add new field
          updatedFields.push(newField);
        }
      });
      return updatedFields;
    });

    setIsFormChanged(true);
  };

  const exportToExcel = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one client to export");
      return;
    }

    const selectedData = data.filter((item) =>
      selectedRowKeys.includes(item.key)
    );

    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");

    // Generate Excel File & Download
    XLSX.writeFile(wb, "clients_export.xlsx");
  };

  const validateAge = (birthDate) => {
    const today = moment();
    const birth = moment(birthDate);
    const age = today.diff(birth, "years");
    return age >= 16;
  };

  const handleDateChange = (e) => {
    const newBirthDate = e.target.value;
    if (validateAge(newBirthDate)) {
      setClientData({
        ...ClientData,
        date_naissance: newBirthDate,
      });
      setFormErrors({
        ...formErrors,
        date_naissance: "",
      });
    } else {
      setFormErrors({
        ...formErrors,
        date_naissance: "L'âge doit être d'au moins 16 ans",
      });
      message.error("L'âge doit être d'au moins 16 ans");
    }
  };

  return (
    <div className="w-full p-2">
      <Modal
        title="Exporter les Clients"
        visible={isExportModalVisible}
        onOk={handleExport}
        onCancel={() => setIsExportModalVisible(false)}
        okText="Exporter"
        cancelText="Annuler"
      >
        <Form layout="vertical">
          <Form.Item label="Statut">
            <Select
              value={exportFilters.statut}
              onChange={(value) =>
                setExportFilters({ ...exportFilters, statut: value })
              }
            >
              <Select.Option value={null}>Tous</Select.Option>
              <Select.Option value={true}>Actif</Select.Option>
              <Select.Option value={false}>Inactif</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date d'inscription">
            <Space>
              <DatePicker
                placeholder="Date de début"
                value={
                  exportFilters.date_inscription_start
                    ? moment(exportFilters.date_inscription_start)
                    : null
                }
                onChange={(date) =>
                  setExportFilters({
                    ...exportFilters,
                    date_inscription_start: date
                      ? date.format("YYYY-MM-DD")
                      : null,
                  })
                }
              />
              <DatePicker
                placeholder="Date de fin"
                value={
                  exportFilters.date_inscription_end
                    ? moment(exportFilters.date_inscription_end)
                    : null
                }
                onChange={(date) =>
                  setExportFilters({
                    ...exportFilters,
                    date_inscription_end: date
                      ? date.format("YYYY-MM-DD")
                      : null,
                  })
                }
              />
            </Space>
          </Form.Item>

          <Form.Item label="Liste noire">
            <Select
              value={exportFilters.blackliste}
              onChange={(value) =>
                setExportFilters({ ...exportFilters, blackliste: value })
              }
            >
              <Select.Option value={null}>Tous</Select.Option>
              <Select.Option value={true}>Sur liste noire</Select.Option>
              <Select.Option value={false}>Pas sur liste noire</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date de naissance">
            <Space>
              <DatePicker
                placeholder="Date de début"
                value={
                  exportFilters.date_naissance_start
                    ? moment(exportFilters.date_naissance_start)
                    : null
                }
                onChange={(date) =>
                  setExportFilters({
                    ...exportFilters,
                    date_naissance_start: date
                      ? date.format("YYYY-MM-DD")
                      : null,
                  })
                }
              />
              <DatePicker
                placeholder="Date de fin"
                value={
                  exportFilters.date_naissance_end
                    ? moment(exportFilters.date_naissance_end)
                    : null
                }
                onChange={(date) =>
                  setExportFilters({
                    ...exportFilters,
                    date_naissance_end: date ? date.format("YYYY-MM-DD") : null,
                  })
                }
              />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Détails du client"
        visible={isDetailsModalVisible}
        onCancel={handleDetailsModalCancel}
        footer={null}
        width={600}
      >
        {selectedClient && (
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
              { key: "1", field: "Civilité", value: selectedClient.civilite },
              {
                key: "2",
                field: "Nom complet",
                value: `${selectedClient.nom_client} ${selectedClient.prenom_client}`,
              },
              { key: "3", field: "Adresse", value: selectedClient.adresse },
              { key: "4", field: "Téléphone", value: selectedClient.tel },
              { key: "5", field: "Mail", value: selectedClient.mail },
              {
                key: "9",
                field: "Date d'inscription",
                value: selectedClient.date_inscription,
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
              placeholder="Search fournisseur"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-6">
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire") &&
            selectedRowKeys.length === 1 ? (
              <EditOutlined
                className="cursor-pointer"
                onClick={handleEditClick}
              />
            ) : (
              ""
            )}

            {/* {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire") &&
            selectedRowKeys.length >= 1 ? (
              <Popconfirm
                title="Supprimer le Fournisseur"
                description="Êtes-vous sûr de supprimer ce Fournisseur?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="cursor-pointer" />{" "}
              </Popconfirm>
            ) : (
              ""
            )} */}
            {/* {(JSON.parse(localStorage.getItem("data"))[0].fonction ===
              "Administration" ||
              JSON.parse(localStorage.getItem("data"))[0].fonction ===
                "secretaire") &&
            selectedRowKeys.length == 1 ? (
              <PrinterOutlined disabled={true} />
            ) : null} */}
            {/* <Button onClick={showExportModal} icon={<DownloadOutlined />}>
              Exporter vers Excel{" "}
            </Button> */}
          </div>
        </div>
        {/* add new client  */}
        <div>
          <div className="flex items-center space-x-3">
            {(JSON.parse(localStorage.getItem("data"))[0].fonction ===
              "Administration" ||
              JSON.parse(localStorage.getItem("data"))[0].fonction ===
                "secretaire") && (
              <Button
                type="default"
                onClick={showDrawerR}
                icon={<UserAddOutlined />}
              >
                Ajouter Fournisseur
              </Button>
            )}
          </div>
          <Drawer
            title="Saisir un nouveau Fournisseur"
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
                  <div className="mt-0 text-center pt-0 rounded-md w-full bg-slate-100">
                    <>
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={() => false}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
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
                    </>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div>
                      <label htmlFor="civilite" className="block font-medium">
                        *Civilité
                      </label>
                      <Select
                        id="civilite"
                        showSearch
                        placeholder="Civilité"
                        className="w-full"
                        optionFilterProp="children"
                        status={formErrors.civilite ? "error" : ""}
                        onChange={(value) =>
                          setClientData({ ...ClientData, civilite: value })
                        }
                        options={[
                          {
                            value: "Monsieur",
                            label: "Monsieur",
                          },
                          {
                            value: "Mademoiselle",
                            label: "Mademoiselle",
                          },
                        ]}
                      />
                    </div>
                    <div>
                      <label htmlFor="societe" className="block font-medium">
                        Nom
                      </label>
                      <Input
                        id="societe"
                        size="middle"
                        placeholder="Nom"
                        value={ClientData.nom}
                        onChange={(e) =>
                          setClientData({
                            ...ClientData,
                            nom: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prenom_client"
                        className="block font-medium"
                      >
                        *Prénom
                      </label>
                      <Input
                        id="prenom_client"
                        size="middle"
                        placeholder="Prénom"
                        value={ClientData.prenom_client}
                        className={
                          formErrors.prenom_client ? "border-red-500" : ""
                        }
                        onChange={(e) =>
                          setClientData({
                            ...ClientData,
                            prenom_client: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="societe" className="block font-medium">
                        *Société
                      </label>
                      <Input
                        id="societe"
                        size="middle"
                        placeholder="Société"
                        value={ClientData.societe}
                        onChange={(e) =>
                          setClientData({
                            ...ClientData,
                            societe: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="num_ice" className="block font-medium">
                        Numéro ICE
                      </label>
                      <Input
                        id="num_ice"
                        size="middle"
                        placeholder="Numéro ICE"
                        value={ClientData.num_ice}
                        onChange={(e) =>
                          setClientData({
                            ...ClientData,
                            num_ice: e.target.value,
                          })
                        }
                      />
                    </div>
                   
                    <div>
                      <label htmlFor="adresse" className="block font-medium">
                        Adresse
                      </label>
                      <Input
                        id="adresse"
                        size="middle"
                        className={formErrors.adresse ? "border-red-500" : ""}
                        placeholder="Adresse"
                        value={ClientData.adresse}
                        onChange={(e) =>
                          setClientData({
                            ...ClientData,
                            adresse: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="tel" className="block font-medium">
                        *Téléphone
                      </label>
                      <Input
                        id="tel"
                        size="middle"
                        status={formErrors.tel ? "error" : ""}
                        placeholder="Téléphone"
                        value={ClientData.tel}
                        onChange={handlePhoneChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="mail" className="block font-medium">
                        Email
                      </label>
                      <Input
                        id="mail"
                        size="middle"
                        status={formErrors.mail ? "error" : ""}
                        type="danger"
                        placeholder="Email"
                        value={ClientData.mail}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="cin" className="block font-medium">
                        CIN
                      </label>
                      <Input
                        id="cin"
                        className={formErrors.cin ? "border-red-500" : ""}
                        size="middle"
                        placeholder="CIN"
                        value={ClientData.cin}
                        onChange={(e) =>
                          setClientData({ ...ClientData, cin: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="ville" className="block font-medium">
                        Ville
                      </label>
                      <Select
                        id="ville"
                        showSearch
                        placeholder="Ville"
                        className="w-full"
                        status={formErrors.ville ? "error" : ""}
                        optionFilterProp="children"
                        onChange={(value) =>
                          setClientData({ ...ClientData, ville: value })
                        }
                        options={[
                          { value: "1", label: "Fes" },
                          { value: "2", label: "Rabat" },
                          { value: "3", label: "Casablanca" },
                          // ... (rest of the cities)
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
      <Modal
        title="Edit Fournisseur"
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
        okButtonProps={{ disabled: !isFormChanged }}
        okText="Soumettre"
        cancelText="Annuler"
      >
        <div className="h-96 overflow-y-auto">
          <Form onValuesChange={handleFormChange} form={form} layout="vertical">
            <Form.Item name="civilite" label="Civilité">
              <Select>
                <Select.Option value="Monsieur">Monsieur</Select.Option>
                <Select.Option value="Mademoiselle">Mademoiselle</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="societe" label="Société">
              <Input />
            </Form.Item>
            <Form.Item name="num_ice" label="Numéro ICE">
              <Input />
            </Form.Item>
            <Form.Item
              name="prenom"
              label="Prénom"
              rules={[{ required: true, message: "Please input Prénom!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: "Please input Prénom!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="adresse" label="Adresse">
              <Input />
            </Form.Item>
            <Form.Item
              name="tel"
              label="Téléphone"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir un numéro de téléphone!",
                },
                {
                  validator: (_, value) =>
                    validateMoroccanPhoneNumber(value)
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Numéro de téléphone marocain invalide")
                        ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mail"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir une adresse email!",
                },
                {
                  validator: (_, value) =>
                    validateEmail(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error("Adresse email invalide")),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="ville" label="Ville">
              <Select>
                <Select.Option value="1">Fes</Select.Option>
                <Select.Option value="2">Rabat</Select.Option>
                <Select.Option value="3">Casablanca</Select.Option>
                {/* ... (rest of the cities) */}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default TableFournisseur;
