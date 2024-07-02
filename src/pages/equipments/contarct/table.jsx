import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  message,
  Popconfirm,
  Drawer,
  Button,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  PrinterOutlined,
  FileAddOutlined,
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
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_contrat || index, // Assuming each item has a unique id, otherwise use index
        }));
        console.log(processedData);
        setData(processedData);
        setFilteredData(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = [
          "client",
          "Prenom_client",
          "abonnement",
          "date_debut",
          "date_fin",
        ];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")), // Capitalize the first letter
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "sitewebetablissement") {
              return (
                <a href={text} target="_blank" rel="noopener noreferrer">
                  {text}
                </a>
              );
            } else if (key == "date_inscription") {
              return <Tag>{text}</Tag>;
            }
            return text;
          },
        }));
        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  return (
    <div className="w-full p-2">
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
