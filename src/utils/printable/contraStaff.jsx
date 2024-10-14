import { getCurrentDate } from "../helper";

export function handlePrintContractStaff(Client, Contart) {
  // Define formatDate function within the scope of handlePrintContractStaff
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const printWindow = window.open("", "", "width=600,height=800");
  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contrat N° ${Contart.id_contratStaff}</title>
        <style>
        * {
            font-size: 16px;
        }
        .container {
            display: flex;
            height: 300px;
            flex-direction: column;
            background-color: blue;
        }
        .header {
            display: flex;
            flex-direction: row;
            height: 150px;
        }
        .header-left {
            flex: 2
        }
        .header-right {
            flex: 1
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: row;
        }
        .client-infos {
            flex: 1
        }
        .club-info {
            flex: 1
        }
        .footer {
            height: 100px;
        }
        span {
            font-size: 12px;
            font-weight: bold;
        }
        .containerTitle{
            display: block;
            height: 50px;
            width: 250px !important;
            align-items: center;
            justify-content: center;
            padding: 6px;
            background-color: #e6e7e9;
            border: 1px solid black;
            text-align: center;
        }
        #title {
            font-size: 20px;
            font-weight: bold;
        }
        .infos tr td {
            text-align: center;
            height: 30px;
            font-size: 13px;
            font-weight: bold;
        }
        ul li {
            font-size: 12px;
            font-weight: 700;
            line-height: 16px;
        }
        .containerPay {
            position: relative;
        }
        .types {
            list-style-type: none;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
        }
        #text-reg {
            font-size: 11px;
            font-weight: 700;
            line-height: 15px;
        }
        .conditions p {
            font-size: 10px !important;
            line-height: 8px;
            text-align: justify;
        }
        .titleCondition {
            font-size: 11px;
            font-weight: bold;
        }
        #tititreCondition {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }
    </style>
    </head>
    <body>
        <table width="100%" aria-expanded="true" height="100%">
            <tbody>
                <tr height="200px" >
                    <td colspan="3">
                        <img src="https://fithouse.pythonanywhere.com/media/assets/logo/logo.jpg" width="180px" />
                    </td>
                    <td colspan="9" style="padding-right: 60px">
                        <div class="containerTitle">
                            <span id="title">Contrat De travail Club Fit House  <br> N°${
                              Contart.id_contratStaff
                            }</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="12">
                        <br/>
                        <br/>
                        <table border="1" class="infos">
                            <tr>
                                <td style="background-color: #e6e7e9;">Prénom</td>
                                <td>${Client.prenom}</td>
                                <td style="background-color: #e6e7e9;">Nom</td>
                                <td colspan="2">${Client.nom}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Adresse</td>
                                <td colspan="4">${Client.adresse}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">CIN</td>
                                <td>${Client.cin}</td>
                                <td style="background-color: #e6e7e9;">Ville</td>
                                <td colspan="2">${Client.ville}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Téléphone portable</td>
                                <td>${Client.tel}</td>
                                <td style="background-color: #e6e7e9;">Téléphone fixe</td>
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Date de naissance</td>
                                <td colspan="4">${formatDate(
                                  Client.date_naissance
                                )}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Email</td>
                                <td colspan="4">${Client.mail}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="12">
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <table border="1" class="infos" style="margin-right: 20px !important;">
                            <tr>
                                <td style="background-color: #e6e7e9;">Date de début</td>
                                <td colspan="3">Le ${formatDate(
                                  Contart.date_debut
                                )}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;"> Type de contrat</td>
                                <td colspan="3">${Contart.type_contrat}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;"> Salaire</td>
                                <td colspan="3">${Contart.salaire} dhs</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="12" style="font-size: 14px">
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <span style="font-size: 14px">Fait à Fes</span><br/>
                        <span style="font-size: 14px">Le ${getCurrentDate()}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="12">
                        <br/>
                        <br/>
                        <br/>
                        <table border="1" class="infos" style="height: 80px;">
                            <thead>
                                <tr>
                                    <td style="background-color: #e6e7e9;">Signature du Salarié(e)</td>
                                    <td style="background-color: #e6e7e9;">Signature de l'employeur</td>
                                </tr>
                            </thead>
                            <tr>
                                <td></td>
                                <td>&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="12">&nbsp; </td>
                </tr>
                <tr >
                    <td colspan="12" >
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div style="text-align: center; border-top: 1px solid black; padding-top: 10px;">
                            <span style="font-size: 13px;">Complexe Sportif de Fés, Route de Sefrou, Tél : 05.35.61.88.53 / watssap : 07.73.06.93.77 </span>
                            <br/>
                            <span style="font-size: 13px;">Email : fithousefes@gmail.com</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}
