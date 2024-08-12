import React, { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

dayjs.locale("fr");
const localizer = dayjsLocalizer(dayjs);

import {
  PlusOutlined,
  FileAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  Button,
  Drawer,
  Space,
  Input,
  Select,
  message,
  Modal,
  Table,
  Switch,
  Segmented
} from "antd";

import { addNewTrace, getCurrentDate } from "../../../utils/helper";

const TableReservations = () => {
  // Code from the first interface
  const fetchReservations = async () => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/reservationService/"
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }
  };

  const transformReservations = (reservations) => {
    return reservations.map((reservation) => ({
      id: reservation.id_rsv_srvc,
      id_service: reservation.id_service,
      title: `Service ${reservation.id_service}`,
      start: new Date(reservation.date_resrv),
      end: new Date(reservation.date_presence),
      allDay: false,
      resource: reservation.status ? "Active" : "Inactive",
      status: reservation.status,
      presence: reservation.presence,
      motif_annulation: reservation.motif_annulation,
    }));
  };

  const [events, setEvents] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isCancellationModalVisible, setIsCancellationModalVisible] =
    useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [ReservationData, setReservationData] = useState({
    id_client: null,
    id_service: null,
    date_resrv: getCurrentDate(),
    date_presence: null,
    status: true,
    presence: false,
    motif_annulation: null,
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

  const fetchServices = async () => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/service/"
      );
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchServices();
    fetchAndTransformReservations();
  }, []);

  const fetchAndTransformReservations = async () => {
    const reservations = await fetchReservations();
    const transformedEvents = transformReservations(reservations);
    setEvents(transformedEvents);
  };

  const isReservationFormValid = () => {
    return (
      ReservationData.id_client !== null &&
      ReservationData.id_service !== null &&
      ReservationData.date_resrv !== null &&
      ReservationData.date_presence !== null
    );
  };

  const addReservation = async () => {
    try {
      if (!isReservationFormValid()) {
        message.error(
          "Please fill in all required fields for the reservation."
        );
        return;
      }

      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/reservationService/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ReservationData),
        }
      );

      if (response.ok) {
        const res = await response.json();
        if (res === "Added Successfully!!") {
          message.success("Réservation ajoutée avec succès");
          onCloseR();
          const id_staff = JSON.parse(localStorage.getItem("data"));
          await addNewTrace(
            id_staff[0].id_employe,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ReservationData)}`,
            "reservation_service"
          );
          fetchAndTransformReservations();
        } else {
          message.warning(res.msg);
        }
      } else {
        message.error("Error adding reservation");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred:", error);
    }
  };

  const updateReservation = async (updatedData) => {
    try {
      updatedData.id_rsv_srvc = updatedData.id;
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/reservationService/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        message.success("Réservation mise à jour avec succès");
        fetchAndTransformReservations();
      } else {
        message.error("Erreur lors de la mise à jour de la réservation");
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
    setReservationData({
      id_client: null,
      id_service: null,
      date_resrv: getCurrentDate(),
      date_presence: null,
      status: true,
      presence: false,
      motif_annulation: null,
    });
  };

  const handleReservationSubmit = () => {
    addReservation();
  };

  const handleEventSelect = (event) => {
    setSelectedReservation(event);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedReservation(null);
  };

  const handlePresenceChange = (checked) => {
    const updatedReservation = { ...selectedReservation, presence: checked };
    setSelectedReservation(updatedReservation);
    updateReservation(updatedReservation);
  };

  const handleStatusChange = (checked) => {
    if (!checked) {
      setIsCancellationModalVisible(true);
    } else {
      const updatedReservation = {
        ...selectedReservation,
        status: checked,
        motif_annulation: null,
      };
      setSelectedReservation(updatedReservation);
      updateReservation(updatedReservation);
    }
  };

  const handleCancellationConfirm = () => {
    const updatedReservation = {
      ...selectedReservation,
      status: false,
      motif_annulation: cancellationReason,
    };
    setSelectedReservation(updatedReservation);
    updateReservation(updatedReservation);
    setIsCancellationModalVisible(false);
    setCancellationReason("");
  };

  const columns = [
    {
      title: "",
      dataIndex: "attribute",
      key: "attribute",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "",
      dataIndex: "value",
      key: "value",
      render: (text, record) => {
        if (record.key === "status") {
          return (
            <Switch
              checked={text}
              onChange={handleStatusChange}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          );
        } else if (record.key === "presence") {
          return (
            <Switch
              checked={text}
              onChange={handlePresenceChange}
              checkedChildren="Présent"
              unCheckedChildren="Absent"
            />
          );
        } else {
          return text;
        }
      },
    },
  ];

  const getTableData = (reservation) => {
    const data = [
      {
        key: "service",
        attribute: "Service",
        value: reservation.title,
      },
      {
        key: "dateReservation",
        attribute: "Date de réservation",
        value: dayjs(reservation.start).format("YYYY-MM-DD"),
      },
      {
        key: "datePresence",
        attribute: "Date de présence",
        value: dayjs(reservation.end).format("YYYY-MM-DD"),
      },
      {
        key: "status",
        attribute: "Statut",
        value: reservation.status,
      },
      {
        key: "presence",
        attribute: "Présence",
        value: reservation.presence,
      },
    ];

    if (!reservation.status) {
      data.push({
        key: "motifAnnulation",
        attribute: "Motif d'annulation",
        value: reservation.motif_annulation || "N/A",
      });
    }

    return data;
  };

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mt-3">
        {/* heresgment */}
        <div>
          <Button
            type="default"
            onClick={showDrawerR}
            icon={<FileAddOutlined />}
          >
            Ajouter Réservation
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
          onSelectEvent={handleEventSelect}
          messages={{
            date: "Date",
            time: "Heure",
            event: "Événement",
            allDay: "Toute la journée",
            week: "Semaine",
            work_week: "Semaine de travail",
            day: "Jour",
            month: "Mois",
            previous: "Précédent",
            next: "Suivant",
            yesterday: "Hier",
            tomorrow: "Demain",
            today: "Aujourd'hui",
            agenda: "Agenda",
            noEventsInRange: "Aucun événement dans cette période.",
            showMore: (total) => `+ ${total} de plus`,
          }}
        />
      </div>
      <Drawer
        title="Saisir une nouvelle réservation"
        size="default"
        onClose={onCloseR}
        open={open1}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="p-3 md:pt-0 md:pl-0 md:pr-10">
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="flex flex-col">
              <label htmlFor="">Client</label>
              <Select
                className="w-full"
                showSearch
                value={ReservationData.id_client}
                onChange={(value) => {
                  setReservationData({
                    ...ReservationData,
                    id_client: value,
                  });
                }}
                placeholder="Client"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
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
            <div className="flex flex-col">
              <label htmlFor="">Service</label>
              <Select
                className="w-full"
                showSearch
                value={ReservationData.id_service}
                onChange={(value) => {
                  setReservationData({
                    ...ReservationData,
                    id_service: value,
                  });
                  setSelectedService(
                    services.find((s) => s.ID_service === value)
                  );
                }}
                placeholder="Service"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={services.map((service) => ({
                  value: service.ID_service,
                  label: service.service,
                }))}
              />
            </div>
          </div>
          {selectedService && (
            <div className="mt-5">
              <p>
                <strong>Description:</strong> {selectedService.description}
              </p>
              <p>
                <strong>Tarif:</strong> {selectedService.Tarif}
              </p>
            </div>
          )}
          <div className="mt-5">
            <label htmlFor="">Date de réservation</label>
            <Input
              type="date"
              value={ReservationData.date_resrv}
              onChange={(e) =>
                setReservationData({
                  ...ReservationData,
                  date_resrv: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-5">
            <label htmlFor="">Date de présence</label>
            <Input
              type="date"
              value={ReservationData.date_presence}
              onChange={(e) =>
                setReservationData({
                  ...ReservationData,
                  date_presence: e.target.value,
                })
              }
            />
          </div>
          <Space className="mt-10">
            <Button danger onClick={onCloseR}>
              Annuler
            </Button>
            <Button onClick={handleReservationSubmit} type="default">
              Réservation
            </Button>
          </Space>
        </div>
      </Drawer>
      <Modal
        title="Détails de la réservation"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        {selectedReservation && (
          <Table
            columns={columns}
            dataSource={getTableData(selectedReservation)}
            pagination={false}
            bordered
          />
        )}
      </Modal>

      <Modal
        title="Motif d'annulation"
        visible={isCancellationModalVisible}
        onOk={handleCancellationConfirm}
        onCancel={() => setIsCancellationModalVisible(false)}
      >
        <Input.TextArea
          rows={4}
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          placeholder="Veuillez saisir le motif d'annulation"
        />
      </Modal>
    </div>
  );
};

const TableReservationServicesPage = () => {
  const fetchReservations = async () => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/reservation/"
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }
  };

  const transformReservations = (reservations) => {
    return reservations.map((reservation) => ({
      id: reservation.id_reservation,
      id_seance: reservation.id_seance,
      title: `${reservation.cour} - ${reservation.cour}`,
      start: new Date(reservation.date_presence + "T" + reservation.heur_debut),
      end: new Date(reservation.date_presence + "T" + reservation.heure_fin),
      datestart: reservation.heur_debut,
      dateend: reservation.heure_fin,
      coach: reservation.coach,
      allDay: false,
      resource: reservation.salle,
    }));
  };

  const [events, setEvents] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [clients, setClients] = useState([]);
  const [Cour, setCour] = useState([]);
  const [Seance, setSeance] = useState([]);
  const [SeancInfos, SetSeancInfos] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState([]);
  const [event, setevent] = useState([]);
  const [add, setAdd] = useState();
  const [selectedEventIdSeance, setSelectedEventIdSeance] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [clientPresence, setClientPresence] = useState({});
  const [isAbsenceModalVisible, setIsAbsenceModalVisible] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const [currentClientId, setCurrentClientId] = useState(null);
  const [ReservationData, setReservationData] = useState({
    id_client: null,
    id_seance: null,
    date_operation: getCurrentDate(),
    date_presence: null,
    status: null,
    presence: null,
    motif_annulation: null,
  });
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);

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
  const updateClientPresence = async (
    clientId,
    isPresent,
    absenceReason = null
  ) => {
    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/update_presence/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({
            id_client: clientId,
            id_seance: SeancInfos.id_seance,
            presence: isPresent,
            motif_absence: absenceReason,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update presence");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating presence:", error);
      throw error;
    }
  };
  const handlePresenceChange = async (checked, clientId) => {
    if (checked) {
      // If marking as present, update directly
      try {
        await updateClientPresence(clientId, true);
        setClientPresence((prev) => ({ ...prev, [clientId]: true }));
        message.success(`Présence mise à jour pour le client ${clientId}`);
      } catch (error) {
        message.error("Erreur lors de la mise à jour de la présence");
      }
    } else {
      // If marking as absent, show the modal for absence reason
      setCurrentClientId(clientId);
      setAbsenceReason("");
      setIsAbsenceModalVisible(true);
    }
  };
  const handleAbsenceConfirm = async () => {
    try {
      await updateClientPresence(currentClientId, false, absenceReason);
      setClientPresence((prev) => ({ ...prev, [currentClientId]: false }));
      message.success(`Absence enregistrée pour le client ${currentClientId}`);
      setIsAbsenceModalVisible(false);
    } catch (error) {
      message.error("Erreur lors de l'enregistrement de l'absence");
    }
  };
  const fetchCours = async () => {
    const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token

    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/cours/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        }
      );
      const data = await response.json();
      setCour(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchSeance = async (id_client, cour_id) => {
    const authToken = localStorage.getItem("jwtToken");
    if (id_client && cour_id) {
      try {
        const response = await fetch(
          `https://fithouse.pythonanywhere.com/api/seance`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        data.data.length == 0 ? message.warning("il n'y a pas de séance") : "";
        setSeance(data.data);
      } catch (error) {
        console.error("Error fetching seance:", error);
      }
    }
  };

  useEffect(() => {
    fetchClients();
    fetchCours();
    setSelectedSeance([]);
  }, []);

  const isReservationFormValid = () => {
    return (
      ReservationData.date_presence !== "" &&
      ReservationData.heur_debut !== "" &&
      ReservationData.heure_fin !== ""
    );
  };

  const addReservation = async () => {
    try {
      if (!isReservationFormValid()) {
        message.error(
          "Please fill in all required fields for the reservation."
        );
        return;
      }
      ReservationData.id_seance = selectedSeance.id_seance;
      ReservationData.date_presence = selectedSeance.date_reservation;
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/reservation/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ReservationData),
        }
      );

      if (response.ok) {
        const res = await response.json();
        if (res.msg === "Added Successfully!!") {
          message.success("Réservation ajoutée avec succès");
          setAdd(Math.random() * 1000);
          onCloseR();
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_employe,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ReservationData)}`,
            "reservation"
          );
        } else {
          message.warning(res.msg);
          console.log(res);
        }
      } else {
        console.log(response);
        message.error("Error adding reservation");
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
    setSelectedSeance([]);
    setReservationData({
      id_client: null,
      id_seance: null,
      date_operation: getCurrentDate(),
      date_presence: null,
      status: null,
      presence: null,
      motif_annulation: null,
    });
  };

  const handleReservationSubmit = () => {
    addReservation();
    setSelectedSeance([]);
  };

  useEffect(() => {
    const fetchAndTransformReservations = async () => {
      const reservations = await fetchReservations();
      const transformedEvents = transformReservations(reservations);
      setEvents(transformedEvents);
    };

    fetchAndTransformReservations();
  }, [add]);

  const fetchClientParSeance = async (e) => {
    console.log("====================================");
    console.log(e);
    console.log("====================================");
    const authToken = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `https://fithouse.pythonanywhere.com/api/Etudiant_by_resevation?id_seance=${e.id_seance}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data); // You can handle the fetched client data here
      setSelectedEventIdSeance(data.data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  const handleModalCancel2 = () => {
    setIsModalVisible2(false);
  };
  const handleModal2 = () => {
    setIsModalVisible2(true);
  };

  useEffect(() => {
    const dataSource = selectedEventIdSeance.map((obj) => ({
      key: obj.id_client, // or any unique identifier
      fullName: `${obj.nom_client} ${obj.prenom_client}`,
      mail: obj.mail,
    }));
    setevent(dataSource);
  }, [selectedEventIdSeance]);

  return (
    <div className="w-full p-2">
      <Modal
        title="Motif d'absence"
        visible={isAbsenceModalVisible}
        onOk={handleAbsenceConfirm}
        onCancel={() => setIsAbsenceModalVisible(false)}
      >
        <Input.TextArea
          rows={4}
          value={absenceReason}
          onChange={(e) => setAbsenceReason(e.target.value)}
          placeholder="Veuillez saisir le motif d'absence"
        />
      </Modal>
      <div className="flex items-center justify-between mt-3">
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
                  Ajouter Réservation
                </Button>
              )}
            </div>
            <Drawer
              title="Saisir une nouvelle réservation"
              size="default"
              onClose={onCloseR}
              closeIcon={false}
              open={open1}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <div className="p-3 md:pt-0 md:pl-0 md:pr-10">
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="flex flex-col">
                    <label htmlFor="">Client</label>
                    <Select
                      className="w-full"
                      showSearch
                      value={ReservationData.id_client}
                      onChange={(value) => {
                        setReservationData({
                          ...ReservationData,
                          id_client: value,
                        });
                        fetchSeance(value, ReservationData.cour);
                      }}
                      placeholder="Client"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").includes(input)
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
                  <div className="flex flex-col">
                    <label htmlFor="">Cours</label>
                    <Select
                      className="w-full"
                      showSearch
                      value={ReservationData.cour}
                      onChange={(value) => {
                        setReservationData({
                          ...ReservationData,
                          cour: value,
                        });
                        fetchSeance(ReservationData.id_client, value);
                      }}
                      placeholder="Cours"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={Cour.map((cour) => ({
                        value: cour.id_cour,
                        label: `${cour.nom_cour}`,
                      }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-5">
                  <label htmlFor="">Seance</label>
                  <Select
                    className="w-full"
                    showSearch
                    disabled={Seance.length <= 0}
                    value={ReservationData.id_seance}
                    onChange={(value) => {
                      const selectedSeance = Seance.find(
                        (seance) => seance.id_seance === value
                      );
                      setSelectedSeance(selectedSeance);
                      setReservationData({
                        ...ReservationData,
                        id_seance: value,
                      });
                    }}
                    placeholder="Seance"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={Seance.map((seance) => ({
                      value: seance.id_seance,
                      label: `${seance.cour} ${seance.day_name} ${seance.heure_debut} ${seance.heure_fin}`,
                    }))}
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="">Creneau</label>
                  <Input
                    disabled={true}
                    className="w-full"
                    value={selectedSeance.date_reservation || ""}
                  />
                </div>
                <div>
                  Du {selectedSeance.heure_debut || ""} à{" "}
                  {selectedSeance.heure_fin || ""}
                </div>
                <Space className="mt-10">
                  <Button danger onClick={onCloseR}>
                    Annuler
                  </Button>
                  <Button onClick={handleReservationSubmit} type="default">
                    Réservation
                  </Button>
                </Space>
              </div>
            </Drawer>
          </>
        </div>
      </div>
      <div className="mt-5">
        <Calendar
          localizer={localizer}
          onDoubleClickEvent={(e) => {
            setIsModalVisible(true);
            fetchClientParSeance(e);
            SetSeancInfos(e);
          }}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
          messages={{
            date: "Date",
            time: "Heure",
            event: "Événement",
            allDay: "Toute la journée",
            week: "Semaine",
            work_week: "Semaine de travail",
            day: "Jour",
            month: "Mois",
            previous: "Précédent",
            next: "Suivant",
            yesterday: "Hier",
            tomorrow: "Demain",
            today: "Aujourd'hui",
            agenda: "Agenda",
            noEventsInRange: "Aucun événement dans cette période.",
            showMore: (total) => `+ ${total} de plus`,
          }}
        />
      </div>
      <Modal
        title={"List des clients"}
        visible={isModalVisible2}
        onOk={handleModalCancel2}
        onCancel={handleModalCancel2}
      >
        <div className="h-96 overflow-y-auto mt-10">
          <Table
            columns={[
              {
                title: "Nom",
                dataIndex: "fullName",
                key: "fullName",
              },
              {
                title: "Mail",
                dataIndex: "mail",
                key: "mail",
              },
            ]}
            dataSource={event}
            pagination={false}
            bordered
            // style={{ height: "400px", overflowY: "auto" }}
            size="small"
          />
        </div>
      </Modal>

      <Modal
        title={"Informations sur la séance"}
        visible={isModalVisible}
        onOk={handleModalCancel}
        onCancel={handleModalCancel}
        footer={[]}
      >
        <div className="h-96 overflow-y-auto mt-10">
          <div>
            <span className="font-medium">Cour</span>:{" "}
            {SeancInfos.title && SeancInfos.title}
          </div>
          <div>
            <span className="font-medium">Heur debut</span>:{" "}
            {SeancInfos.datestart}
          </div>
          <div>
            <span className="font-medium">Heur de fine</span>:{" "}
            {SeancInfos.dateend}
          </div>
          <div>
            <span className="font-medium">Salle</span>:{" "}
            {SeancInfos.resource && SeancInfos.resource}
          </div>

          <div className="h-96 overflow-y-auto mt-10">
            <div>List des clients</div>
            <Table
              columns={[
                {
                  title: "Nom",
                  dataIndex: "fullName",
                  key: "fullName",
                },
                {
                  title: "Mail",
                  dataIndex: "mail",
                  key: "mail",
                },
                // {
                //   title: "Présence",
                //   key: "presence",
                //   render: (_, record) => (
                //     <Switch
                //       defaultValue={true}
                //       checked={clientPresence[record.key] || false}
                //       onChange={(checked) =>
                //         handlePresenceChange(checked, record.key)
                //       }
                //     />
                //   ),
                // },
              ]}
              dataSource={event}
              pagination={false}
              bordered
              // style={{ height: "400px", overflowY: "auto" }}
              size="small"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const TableReservationServices = () => {
  const [activeTab, setActiveTab] = useState("reservations");

  return (
    <div className="w-full p-2">
      <Segmented
       className="ml-2"
        value={activeTab}
        onChange={(value) => setActiveTab(value)}
        options={[
          {
            label: "Reservations Services",
            value: "reservations",
          },
          {
            label: "Reservation",
            value: "reservation-services",
          },
        ]}
      />

      {activeTab === "reservations" && <TableReservations />}
      {activeTab === "reservation-services" && <TableReservationServicesPage />}
    </div>
  );
};

