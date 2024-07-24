import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  message,
  Popconfirm,
  Modal,
  Drawer,
  Button,
  Spin,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  PrinterOutlined,
  FileAddOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  addMonths,
  addNewTrace,
  getCurrentDate,
  toCapitalize,
} from "../../../utils/helper";
import dayjs from "dayjs";
import { handlePrintContract } from "../../../utils/printable/contract";

const TableContract = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [clients, setClients] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [abonnements, setAbonnements] = useState([]);
  const [tarif, setTarif] = useState(0);
  const [add, setAdd] = useState(0);
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  // State for contract related data
  const [ContractData, setContractData] = useState({
    id_client: "",
    date_debut: getCurrentDate(),
    date_fin: null,
    reste: null,
    id_abn: null,
    Type: true,
    type: "",
    reduction: "",
    id_etablissement: 19,
    abonnement: "",
    Mode_reglement: "Espèces",
    description: "",
    montant: null,
    id_admin: null,
  });

  const handleViewDetails = (record) => {
    setSelectedContract(record);
    setIsModalVisible(true);
    setTransactionData([]); // Reset transaction data when opening a new contract
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedContract(null);
  };
  const fetchClients = async () => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/clients/"
      );
      const data = await response.json();
      setClients(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchTransactions = async (id_contrat) => {
    try {
      const response = await fetch(
        `https://Jyssr.pythonanywhere.com/api/transaction_by_contrat_id/?id_contrat=${id_contrat}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setTransactionData(data.data);
      setTransactionModalVisible(true);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error("An error occurred while fetching transactions");
    }
  };

  const fetchAbonnements = async () => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/abonnement/"
      );
      const data = await response.json();
      setAbonnements(data.data);
    } catch (error) {
      console.error("Error fetching abonnements:", error);
    }
  };

  useEffect(() => {
    // console.log(JSON.stringify(localStorage.getItem("data")));
    fetchClients();
    fetchAbonnements();
    const adminData = JSON.parse(localStorage.getItem("data"));
    const initialAdminId = adminData ? adminData[0].id_admin : ""; // Accessing the first element's id_admin
    ContractData.id_admin = initialAdminId;
  }, []);

  const handlePrint = () => {
    selectedRowKeys.map(async (key) => {
      const ContractData = data.find((client) => client.key === key);
      const Client = clients.filter(
        (client) => client.id_client === ContractData.id_client
      );
      handlePrintContract(
        ContractData.client,
        ContractData.Prenom_client,
        Client[0].mail,
        Client[0].adresse,
        Client[0].nom_ville,
        Client[0].tel,
        ContractData.date_debut
      );
    });
  };

  // Validation function to check if all required fields are filled for the contract form
  const isContractFormValid = () => {
    return ContractData.date_debut !== null && ContractData.date_fin !== null;
  };

  // Function to add a new contract
  const addContract = async () => {
    const date = new Date(ContractData.date_fin);
    // Extract the year, month, and day from the date
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // Months are zero-based
    let day = date.getDate();

    ContractData.date_fin = `${year}-${month}-${day}`;
    // const adminData = JSON.parse(localStorage.getItem("data"));
    // const initialAdminId = adminData ? adminData[0].id_admin : ""; // Accessing the first element's id_admin
    // // ContractData.id_admin = initialAdminId;
    const id_staff = JSON.parse(localStorage.getItem("data"));
    ContractData.id_admin = id_staff[0].id_employe;

    const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/contrat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
          body: JSON.stringify(ContractData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.msg === "Added Successfully!!") {
          message.success("Contrat ajouté avec succès");
          setAdd(Math.random() * 1000);
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_employe,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ContractData)}`,
            "contrat"
          );
          onCloseR();
        } else {
          message.warning(res.msg);
          console.log(res);
        }
      } else {
        console.log(response);
        message.error("Error adding contract");
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
    setActiveStep(0);
    setContractData({
      id_client: "",
      date_debut: getCurrentDate(),
      date_fin: null,
      reste: null,
      id_abn: null,
      Type: true,
      type: "",
      reduction: "",
      id_etablissement: 19,
      abonnement: "",
      Mode_reglement: "Espèces",
      description: "",
      montant: null,
      id_admin: null,
    });
  };

  // stepper
  const steps = [
    {
      label: "Informations de contrat",
      description: (
        <div className="w-full grid grid-cols-2 gap-4 mt-5">
          <div>
            <label htmlFor="dateDebut">Date de Début</label>
            <DatePicker
              id="dateDebut"
              className="w-full"
              size="middle"
              placeholder="Date de Début"
              value={dayjs(getCurrentDate())}
              disabled={true}
              onChange={(date, dateString) =>
                setContractData({ ...ContractData, date_debut: dateString })
              }
            />
          </div>
          <div>
            <label htmlFor="dateFin">Date de Fin</label>
            <DatePicker
              className="w-full"
              id="dateFin"
              size="middle"
              placeholder="Date de Fin"
              disabled={true}
              value={ContractData.date_fin && dayjs(ContractData.date_fin)}
              onChange={(date, dateString) => {
                setContractData({
                  ...ContractData,
                  date_fin: date,
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="abonnement">Abonnement</label>
            <Select
              id="abonnement"
              showSearch
              className="w-full"
              placeholder="Abonnement"
              value={ContractData.abonnement}
              onChange={(value) => {
                const selectedAbonnement = abonnements.find(
                  (abonnement) => abonnement.id_abn === value
                );
                if (selectedAbonnement) {
                  const {
                    tarif,
                    duree_mois,
                    id_abn,
                    type_abonnement,
                    namecat_conrat,
                  } = selectedAbonnement;
                  const endDate = addMonths(duree_mois);
                  setContractData((prevContractData) => ({
                    ...prevContractData,
                    id_abn: id_abn,
                    date_fin: endDate,
                    tarif: tarif,
                    abonnement: `${type_abonnement} ${namecat_conrat}`, // Update abonnement here
                  }));
                  ContractData.reste = tarif;
                  setTarif(tarif);
                }
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").startsWith(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={abonnements.map((abonnement) => ({
                value: abonnement.id_abn,
                label: `${abonnement.type_abonnement} (${abonnement.namecat_conrat})`,
              }))}
            />
          </div>
          <div>
            <label htmlFor="client">Client</label>
            <Select
              id="client"
              showSearch
              value={ContractData.id_client}
              className="w-full"
              onChange={(value) =>
                setContractData({ ...ContractData, id_client: value })
              }
              placeholder="Client"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").startsWith(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={clients.map((client) => ({
                value: client.id_client,
                label: `${client.nom_client} ${client.prenom_client}`,
              }))}
            />
          </div>
          <div>
            <label htmlFor="reduction">Réduction</label>
            <Input
              id="reduction"
              size="middle"
              placeholder="Réduction"
              value={ContractData.reduction}
              onChange={(e) => {
                if (e.target.value > tarif) {
                  message.warning("Réduction doit être inférieur au tarif ");
                  return;
                }
                ContractData.reste = ContractData.reste - e.target.value;
                setContractData({
                  ...ContractData,
                  reduction: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="tarif">Tarif D'abonnement</label>
            <Input
              id="tarif"
              disabled={true}
              size="middle"
              placeholder="Tarif"
              value={ContractData.tarif}
              onChange={(e) =>
                setContractData({
                  ...ContractData,
                  tarif: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <Select
              id="type"
              showSearch
              placeholder="Type"
              value={ContractData.type} // Use ContractData.Type instead of ContractData.type
              className="w-full"
              onChange={(value) =>
                setContractData((prevContractData) => ({
                  ...prevContractData,
                  type: value,
                }))
              } // Use setContractData to update ContractData state
              options={[
                {
                  value: "Homme",
                  label: "Homme",
                },
                {
                  value: "Femme",
                  label: "Femme",
                },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      label: "Ajouter un contrat",
      description: (
        <div className="w-full grid grid-cols-2 gap-4 mt-5">
          <div>
            <label htmlFor="montant">Montant</label>
            <Input
              id="montant"
              size="middle"
              placeholder="Montant"
              value={ContractData.montant}
              onChange={(e) => {
                ContractData.reste = tarif - e.target.value;
                if (e.target.value > tarif) {
                  message.warning(
                    "Le montant saisie doit être inférieur au tarif "
                  );
                  return;
                }
                setContractData({
                  ...ContractData,
                  montant: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="resteActuel">Le rest actuel</label>
            <Input
              id="resteActuel"
              disabled={true}
              size="middle"
              placeholder="Le rest actuel"
              value={tarif - ContractData.montant}
              onChange={(e) =>
                setContractData({
                  ...ContractData,
                  reste: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor="modeReglement">Mode de Règlement</label>
            <Select
              id="modeReglement"
              showSearch
              value={ContractData.Mode_reglement}
              className="w-full"
              placeholder="Mode de Reglement"
              onChange={(value) =>
                setContractData({ ...ContractData, Mode_reglement: value })
              }
              options={[
                {
                  value: "Chèques",
                  label: "Chèques",
                },
                {
                  value: "Espèces",
                  label: "Espèces",
                },
                {
                  value: "Prélèvements",
                  label: "Prélèvements",
                },
                {
                  value: "Autre",
                  label: "Autre",
                },
              ]}
            />
          </div>
          <div>
            <label htmlFor="typeTransaction">Type de transacation</label>
            <Select
              id="typeTransaction"
              showSearch
              className="w-full"
              value={ContractData.Type}
              placeholder="Type de transacation"
              onChange={(value) =>
                setContractData({ ...ContractData, Type: value })
              }
              options={[
                {
                  value: true,
                  label: "Entrée",
                },
                {
                  value: false,
                  label: "Sortie",
                },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      label: "Final",
      description: (
        <div className="mt-4">
          <Table
            columns={[
              {
                title: "Contract Data",
                key: "data",
                render: () => (
                  <div>
                    {Object.entries(ContractData).map(([key, value]) => {
                      if (
                        key === "id_client" ||
                        key === "id_abn" ||
                        key === "id_etablissement" ||
                        key === "Type" ||
                        key === "description" ||
                        key === "id_admin"
                      )
                        return null;
                      return (
                        <div key={key} style={{ display: "flex" }}>
                          <span
                            style={{ fontWeight: "bold", marginRight: "8px" }}
                          >
                            {toCapitalize(key.replaceAll("_", " "))}:
                          </span>
                          <span>{value}</span>
                        </div>
                      );
                    })}
                  </div>
                ),
              },
            ]}
            dataSource={[ContractData]}
            pagination={false}
            rowKey="id_contrat" // Assuming 'id_contrat' is a unique identifier in your data
          />
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      addContract();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://fithouse.pythonanywhere.com/api/contrat/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const jsonData = await response.json();
        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_contrat || index,
        }));
        console.log(processedData);
        setData(processedData);
        setFilteredData(processedData);

        // Updated desiredKeys with more meaningful French names
        const desiredKeys = [
          { key: "client", label: "Nom" },
          { key: "Prenom_client", label: "Prénom" },
          { key: "abonnement", label: "Type d'Abonnement" },
          { key: "reduction", label: "Réduction" },
          { key: "type", label: "Genre" },
          { key: "date_debut", label: "Date de Début" },
          { key: "date_fin", label: "Date de Fin" },
          { key: "cat_abn", label: "Catégorie d'Abonnement" },
          { key: "actions", label: "Actions" },
        ];

        const generatedColumns = desiredKeys.map(({ key, label }) => ({
          title: label,
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "reduction") {
              return `${text} MAD`;
            } else if (key === "actions") {
              return (
                <EyeOutlined
                  onClick={() => handleViewDetails(record)}
                  style={{ cursor: "pointer" }}
                />
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
  }, [authToken, add]);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.client.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const ContractData = data.find((client) => client.key === key);
          console.log(ContractData);
          const response = await fetch(
            `https://fithouse.pythonanywhere.com/api/contrat/${ContractData.id_contrat}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(ContractData),
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
            `${JSON.stringify(ContractData)}`,
            "contrat"
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
          `${selectedRowKeys.length} contact(s) supprimé(s) avec succès`
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

  const detailColumns = [
    {
      title: "Champ",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Valeur",
      dataIndex: "value",
      key: "value",
      render: (text) => {
        if (typeof text === "boolean") {
          return text ? "Oui" : "Non";
        }
        return text || "Non spécifié";
      },
    },
  ];

  const getDetailData = (contract) => {
    if (!contract) return [];

    return [
      // { key: "section1", property: "Informations Personnelles", value: "" },
      {
        key: "fullName",
        property: "Nom Complet du Client",
        value: `${contract.client || ""} ${
          contract.Prenom_client || ""
        }`.trim(),
      },
      { key: "type", property: "Genre", value: contract.type },
      // { key: "section2", property: "Informations du Contrat", value: "" },
      {
        key: "numcontrat",
        property: "Numéro de Contrat",
        value: contract.numcontrat,
      },
      {
        key: "date_debut",
        property: "Date",
        value: "de " + contract.date_debut + " à " + contract.date_fin,
      },
      // { key: "date_fin", property: "Date de Fin", value: contract.date_fin  },
      {
        key: "etablissemnt",
        property: "Établissement",
        value: contract.etablissemnt,
      },
      {
        key: "abonnement",
        property: "Type d'Abonnement",
        value: contract.abonnement,
      },
      {
        key: "cat_abn",
        property: "Catégorie d'Abonnement",
        value: contract.cat_abn,
      },
      // { key: "section3", property: "Informations Financières", value: "" },
      {
        key: "reduction",
        property: "Réduction",
        value:
          contract.reduction !== undefined
            ? `${contract.reduction} MAD`
            : undefined,
      },
      {
        key: "reste",
        property: "Montant Restant",
        value:
          contract.reste !== undefined ? `${contract.reste} MAD` : undefined,
      },
    ];
  };

  const detailData = selectedContract
    ? Object.entries(selectedContract)
        .filter(([key]) => !key.startsWith("id_")) // Filter out properties starting with 'id_'
        .map(([key, value]) => ({
          key,
          property:
            key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          value:
            typeof value === "object" ? JSON.stringify(value) : String(value),
        }))
    : [];

  const handlePrintReceipt = (transaction) => {
    setSelectedTransaction(transaction);
    // You would implement the actual printing logic here.
    // For now, we'll just show a message
    message.success("Preparing to print receipt...");
    // TODO: Implement actual receipt printing logic
  };

  return (
    <div className="w-full p-2">
      <Modal
        title="Détails du Contrat Client"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <Button
          type=""
          className="mb-5 mt-5"
          onClick={() => fetchTransactions(selectedContract?.id_contrat)}
        >
          Afficher les transactions
        </Button>
        {selectedContract ? (
          <Table
            columns={detailColumns}
            dataSource={getDetailData(selectedContract)}
            pagination={false}
            size="small"
            className="mt-3"
          />
        ) : (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        )}
      </Modal>
      <Modal
        title="Détails des Transactions"
        visible={transactionModalVisible}
        onCancel={() => setTransactionModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={[
            { title: "Date", dataIndex: "date", key: "date" },
            {
              title: "Type",
              dataIndex: "Type",
              key: "Type",
              render: (text) => (text ? "Entrée" : "Sortie"),
            },
            { title: "Montant", dataIndex: "montant", key: "montant" },
            {
              title: "Mode de règlement",
              dataIndex: "Mode_reglement",
              key: "Mode_reglement",
            },
            {
              title: "Description",
              dataIndex: "description",
              key: "description",
            },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => (
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrintReceipt(record)}
                >
                  Imprimer Reçu
                </Button>
              ),
            },
          ]}
          dataSource={transactionData}
          pagination={false}
          size="small"
        />
      </Modal>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-7">
          <div className="w-52">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Client"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-6">
            {selectedRowKeys.length === 1 ? "" : ""}
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire") &&
            selectedRowKeys.length >= 1 ? (
              <Popconfirm
                title="Supprimer le contact"
                description="Êtes-vous sûr de supprimer ce contact ?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="cursor-pointer" />{" "}
              </Popconfirm>
            ) : (
              ""
            )}
            {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire") &&
            selectedRowKeys.length >= 1 ? (
              <PrinterOutlined onClick={handlePrint} disabled={true} />
            ) : (
              ""
            )}
          </div>
        </div>
        {/* add contract */}
        <div>
          <>
            <div className="flex items-center space-x-3">
              {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "Administration" ||
                JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                  "secretaire") && (
                <Button
                  type="default"
                  onClick={showDrawerR}
                  icon={<FileAddOutlined />}
                >
                  Ajouter Contrat
                </Button>
              )}
            </div>
            <Drawer
              title="Saisir un nouveau Contrat"
              width={720}
              onClose={onCloseR}
              closeIcon={false}
              open={open1}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <div>
                <Box sx={{ maxWidth: 400 }}>
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          optional={
                            index === 2 ? (
                              <Typography variant="caption">
                                Dernière étape
                              </Typography>
                            ) : null
                          }
                        >
                          {step.label}
                        </StepLabel>
                        <StepContent>
                          <Typography>{step.description}</Typography>
                          <Box sx={{ mb: 2 }}>
                            <div>
                              <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                              >
                                {index === steps.length - 1
                                  ? "Terminer"
                                  : "Continuer"}
                              </Button>
                              <Button
                                className="ml-3 mt-3"
                                disabled={index === 0}
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1, ml: 2 }}
                              >
                                Retour
                              </Button>
                            </div>
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                      <Typography>Toutes les étapes sont terminées</Typography>
                      <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Réinitialiser
                      </Button>
                    </Paper>
                  )}
                </Box>
              </div>
            </Drawer>
          </>
        </div>
      </div>
      <Table
        pagination={{
          pageSize: 7,
          showQuickJumper: true,
        }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        size="small"
        className="w-full mt-5"
        columns={columns}
        dataSource={filteredData}
        loading={Loading}
      />
    </div>
  );
};

export default TableContract;
