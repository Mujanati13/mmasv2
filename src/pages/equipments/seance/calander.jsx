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

// French translations
const messages = {
  today: "Aujourd'hui",
  detailsLabel: "Détails",
  allDayLabel: "Toute la journée",
  titleLabel: "Titre",
  commitCommand: "Enregistrer",
  moreInformationLabel: "Plus d'informations",
  repeatLabel: "Répéter",
  notesLabel: "Notes",
  never: "Jamais",
  daily: "Quotidien",
  weekly: "Hebdomadaire",
  monthly: "Mensuel",
  yearly: "Annuel",
  repeatEveryLabel: "Répéter chaque",
  daysLabel: "jour(s)",
  endRepeatLabel: "Fin de répétition",
  onLabel: "Le",
  afterLabel: "Après",
  occurrencesLabel: "occurrences",
  weeksOnLabel: "semaine(s) le",
  monthsLabel: "mois",
  ofEveryMonthLabel: "de chaque mois",
  theLabel: "Le",
  firstLabel: "Premier",
  secondLabel: "Deuxième",
  thirdLabel: "Troisième",
  fourthLabel: "Quatrième",
  lastLabel: "Dernier",
  yearsLabel: "année(s)",
  ofLabel: "de",
  everyLabel: "Chaque",
};

// French day names
const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

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
    const authToken = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        "https://fithouse.pythonanywhere.com/api/seance/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      const formattedData = data.data.map((item) => ({
        id: item.id_seance,
        title: item.cour,
        startDate: convertToDateTime(item).startDate,
        endDate: convertToDateTime(item).endDate,
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
    <Paper>
      <Scheduler data={data} height={410} locale="fr-FR" messages={messages}>
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
        <WeekView
          startDayHour={9}
          endDayHour={17}
          dayScaleCellComponent={(props) => (
            <WeekView.DayScaleCell {...props} formatDate={() => dayNames[props.startDate.getDay()]} />
          )}
        />
        <AllDayPanel messages={{allDay: 'Toute la journée'}} />
        <EditRecurrenceMenu />
        <ConfirmationDialog messages={{confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer cet rendez-vous ?'}} />
        <Appointments />
        <AppointmentTooltip showOpenButton showDeleteButton />
        <AppointmentForm messages={messages} />
      </Scheduler>
    </Paper>
  );
};

export default CalendrierGrand;