import { DualAxes } from "@ant-design/plots";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker, Spin } from "antd";

const { RangePicker } = DatePicker;

const DemoDualAxes = () => {
  const [donnees, setDonnees] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [plageDate, setPlageDate] = useState([
    moment().subtract(1, "month"),
    moment(),
  ]);
  const jetonAuth = localStorage.getItem("jwtToken");

  useEffect(() => {
    recupererDonnees();
  }, [plageDate]);

  const recupererDonnees = async () => {
    setChargement(true);
    try {
      const [debut, fin] = plageDate;
      const reponse = await fetch(
        `https://fithouse.pythonanywhere.com/api/reservations/date/course/?start_date=${debut.format(
          "YYYY-MM-DD"
        )}&end_date=${fin.format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: jetonAuth,
          },
        }
      );
      if (!reponse.ok) {
        throw new Error("La réponse du réseau n'était pas correcte");
      }
      const donneesJson = await reponse.json();

      const donneesHebdomadaires = traiterDonnees(donneesJson);
      setDonnees(donneesHebdomadaires);
    } catch (erreur) {
      console.error("Échec de la récupération des données:", erreur);
    } finally {
      setChargement(false);
    }
  };

  const traiterDonnees = (donneesJson) => {
    const donneesHebdomadaires = {};

    Object.entries(donneesJson).forEach(([date, cours]) => {
      const semaine = moment(date).format("YYYY-[S]WW");
      if (!donneesHebdomadaires[semaine]) {
        donneesHebdomadaires[semaine] = { valeur: 0, nombre: 0 };
      }
      donneesHebdomadaires[semaine].valeur += Object.values(cours).reduce(
        (acc, val) => acc + val,
        0
      );
      donneesHebdomadaires[semaine].nombre += 1;
    });

    return Object.entries(donneesHebdomadaires)
      .map(([semaine, { valeur, nombre }]) => ({
        annee: semaine,
        valeur,
        nombre,
      }))
      .sort((a, b) =>
        moment(a.annee, "YYYY-[S]WW").diff(moment(b.annee, "YYYY-[S]WW"))
      );
  };

  const configuration = {
    data: donnees,
    xField: "annee",
    legend: {
      position: "top",
    },
    height: 400,
    children: [
      {
        type: "line",
        yField: "valeur",
        smooth: true,
        style: {
          stroke: "#5B8FF9",
          lineWidth: 3,
        },
        point: {
          size: 5,
          shape: "diamond",
          style: {
            fill: "white",
            stroke: "#5B8FF9",
            lineWidth: 2,
          },
        },
        axis: {
          y: {
            title: "Réservations Totales",
            style: { titleFill: "#5B8FF9" },
          },
        },
      },
      {
        type: "line",
        yField: "nombre",
        smooth: true,
        style: {
          stroke: "#5AD8A6",
          lineWidth: 1,
        },
        point: {
          size: 1,
          shape: "circle",
          style: {
            fill: "white",
            stroke: "#5AD8A6",
            lineWidth: 1,
          },
        },
        axis: {
          y: {
            position: "right",
            title: "Nombre de Cours",
            style: { titleFill: "#5AD8A6" },
          },
        },
      },
    ],
    xAxis: {
      label: {
        formatter: (v) => moment(v, "YYYY-[S]WW").format("DD MMM"),
      },
    },
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };

  const gererChangementPlageDates = (dates) => {
    setPlageDate(dates);
  };

  return (
    <div>
      <RangePicker
        // value={plageDate}
        onChange={gererChangementPlageDates}
        style={{ marginBottom: 10 }}
      />
      {chargement ? (
        <Spin size="small" className="ml-3" />
      ) : (
        <DualAxes className="w-full" {...configuration} />
      )}
    </div>
  );
};

export default DemoDualAxes;