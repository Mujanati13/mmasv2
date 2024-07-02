import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
} from "@devexpress/dx-react-scheduler-material-ui";
import { convertToDateTime, getCurrentDate } from "../../../utils/helper";

const CalendrierGrand = () => {
  const [data, setData] = useState([]);
  const [currentDate] = useState(getCurrentDate());
  const [addedAppointment, setAddedAppointment] = useState({});
  const [appointmentChanges, setAppointmentChanges] = useState({});
  const [editingAppointment, setEditingAppointment] = useState(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const authToken = localStorage.getItem("jwtToken"); // Remplacez par votre véritable jeton d'authentification

    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/seance/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Inclure le jeton d'authentification dans les en-têtes
          },
        }
      );

      const data = await response.json();
    //   console.log(data.data);
      const formattedData = data.data.map((item) => ({
        id: item.id_seance,
        title: item.cour,
        startDate: convertToDateTime(item).startDate,
        endDate:  convertToDateTime(item).endDate,
      }));

      setData(formattedData);
      console.log(formattedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  const commitChanges = ({ added, changed, deleted }) => {
    setData((prevData) => {
      let updatedData = prevData;
      if (added) {
        const startingAddedId =
          updatedData.length > 0
            ? updatedData[updatedData.length - 1].id + 1
            : 0;
        updatedData = [...updatedData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        updatedData = updatedData.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        updatedData = updatedData.filter(
          (appointment) => appointment.id !== deleted
        );
      }
      return updatedData;
    });
  };

  return (
    <Paper >
      <Scheduler  data={data} height={410}>
        <ViewState currentDate={currentDate} />
        <EditingState
          onCommitChanges={commitChanges}
          addedAppointment={addedAppointment}
          onAddedAppointmentChange={setAddedAppointment}
          appointmentChanges={appointmentChanges}
          onAppointmentChangesChange={setAppointmentChanges}
          editingAppointment={editingAppointment}
          onEditingAppointmentChange={setEditingAppointment}
        />
        <WeekView startDayHour={9} endDayHour={17} />
        <AllDayPanel />
        <EditRecurrenceMenu />
        <ConfirmationDialog />
        <Appointments />
        <AppointmentTooltip showOpenButton showDeleteButton />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
};

export default CalendrierGrand;
