import { getCurrentDate } from "../helper";
import download from "downloadjs";
export function handlePrintContract(
 cleintobj ,
 contartobj
) {
  if (true) {
    const printWindow = window.open("", "", "width=600,height=800");
    printWindow.document.open();
    printWindow.document.write(
      `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                        <span id="title">CONTRAT D'ABONNEMENT Club Fit House  <br> N°${contartobj.numcontrat}</span>
                    </div>
                    <h5>Saison : ${new Date(contartobj.date_debut).getFullYear()}-${new Date(contartobj.date_fin).getFullYear()}</h5>
                </td>
            </tr>
            <tr >
                <td colspan="12">
                    <br/>
                    <span>Pour souscrire un abonnement Fit House, merci de bien vouloir compléter en MAJUSCULES et SIGNER le formulaire
                        ci-dessous : </span>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <table border="1" class="infos">
                        <tr>
                            <td style="background-color: #e6e7e9;">Civilité</td>
                            <td>
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/${cleintobj.civilite === 'Mademoiselle' ? 'radio' : 'empty'}.png" />
                                &nbsp;Mademoiselle
                            </td>
                            <td>
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/${cleintobj.civilite === 'Madame' ? 'radio' : 'empty'}.png" />
                                &nbsp; Madame
                            </td>
                            <td colspan="2">
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/${cleintobj.civilite === 'Monsieur' ? 'radio' : 'empty'}.png" />
                                &nbsp;  Monsieur
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Prénom</td>
                            <td>${cleintobj.prenom_client}</td>
                            <td style="background-color: #e6e7e9;">Nom</td>
                            <td colspan="2">${cleintobj.nom_client}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Adresse</td>
                             <td colspan="4">${cleintobj.adresse}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Code Postal</td>
                            <td></td>
                            <td style="background-color: #e6e7e9;">Ville</td>
                            <td colspan="2">${cleintobj.nom_ville}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Téléphone portable</td>
                            <td>${cleintobj.tel}</td>
                            <td style="background-color: #e6e7e9;">Téléphone fixe</td>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Date de naissance</td>
                             <td colspan="4">${cleintobj.date_naissance}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;">Email</td>
                             <td colspan="4">${cleintobj.mail}</td>
                        </tr>
                        <tr>
                             <td colspan="5">
                                <span style="font-size: 11px;">J'accepte de recevoir des informations par mail de la part de Fit House </span>
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/${cleintobj.newsletter ? 'radio' : 'empty'}.png" />
                                 OUI
                                 <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/${!cleintobj.newsletter ? 'radio' : 'empty'}.png" />
                                 NON
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <br/>
                    <span style="font-size: 14px;">Documents à fournir pour l'inscription :</span>
                    <br/>
                    <span>- une piéce d'identité en cours de validité.</span><br/>
                    <span>- un certificat médical récent, attestant de ma capacité à pratiquer une activité sportive. </span>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <br/>
                    <table border="1" class="infos" style="margin-right: 20px !important;">
                        <tr>
                            <td style="background-color: #e6e7e9;">Date de début D'abonnement</td>
                             <td colspan="3"> Le ${new Date(contartobj.date_debut).getDate()}/ ${new Date(contartobj.date_debut).getMonth() + 1}/ ${new Date(contartobj.date_debut).getFullYear()}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #e6e7e9;"> Type D'abonnement</td>
                             <td colspan="3">${contartobj.type}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <br/>
                    <span>Mode De Réglement :</span>
                    <div class="containerPay">
                        <ul class="types">
                            <li>
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/empty.png" />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Chéques <li>
                            <li>
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/empty.png" />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Espéces <li>
                            <li>
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/empty.png" />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Prélèvements <li>
                            <li>
                                <img width="16px" height="16px" src="https://fithouse.pythonanywhere.com/media/assets/objects/empty.png" />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Autres ......................</li>
                        </ul>
                    </div>
                    <div>
                        <p id="text-reg">Je soussigné(e) : <i><strong>${cleintobj.nom_client} ${cleintobj.prenom_client}</strong></i> déclare souscrire un abonnement nominatif pour la durée de validité ci-dessus. Cet abonnement m'autorise à utiliser les installations aux
horaires fixés par la Direction et à participer à l'ensemble des activités proposées par STAF Fitness (hors activités
annexes ). II n'est ni transférable, ni remboursable. Je déclare que mon état de santé me permet de participer aux cours
proposés par l'Etablissement et m'engage à fournir un certificat médical d'apitude à la pratique du sport en salle datant
de moins de 1 mois lors de ma premiére séance .Celui-ci devra ensuite être renouvelé tous les ans. Je déclare avoir pris
connaissance du réglement intérieur de STAF Fitness (affiché dans le studio ainsi qu'au verso de ce document) et devoir
m'y conformer en totalité.
                        </p>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="12" style="font-size: 14px">
                    <br/>
                    <span style="font-size: 14px">Fait à Fes</span><br/>
                    <span style="font-size: 14px">Le ${getCurrentDate()} </span>
                </td>
            </tr>
            <tr>
                <td colspan="12">
                    <br/>
                    <table border="1" class="infos" style="height: 80px;">
                        <thead>
                            <tr>
                                <td style="background-color: #e6e7e9;">Signature de L'adhérant (e)</td>
                                <td style="background-color: #e6e7e9;">Signature du Conseiller</td>
                            </tr>
                        </thead>
                        <tr>
                            <td ></td>
                            <td >&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="12">&nbsp; </td>
            </tr>
            <tr >
                <td colspan="12" >
                    <div style="text-align: center; border-top: 1px solid black; padding-top: 10px;">
                        <span style="font-size: 13px;"> n163 lot  les perles de fes rte immz fes, Tél : 05.35.61.88.53 / watssap : 07.73.06.93.77 </span>
                        <br/>
                        <span style="font-size: 13px;">Email : fithousefes@gmail.com</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
     <tr >
                <td colspan="12" style="padding-right: 60px">
                    <div class="containerTitle">
                        <span id="tititreCondition">CONDITION GENERAS DE VENTES ET REGLEMENT INTERIEUR</span>
                    </div>
                </td>
     </tr>
     <tr>
        <td colspan="12">
            <table>
                <td class="conditions"  style="padding-right : 10px;">
                    <br/> <br/>
                    <br/>
                    <p style="font-size: 9px !important;"><strong>Les conditions générales et leur application:</strong></p>
                    <p>
                        - Les conditions générales - au dessous - régissent les realations
                            contractuelles du club, de remise en forme objet de ce contrat de
                            l'adhérent contractant.<br/>
                            Aucune condition particuliére ne peut, sauf acceptation formelle et
                            écrite du club ou de son mandataire commercialsant, prévoir contre les
                            conditions générales. Toute condition contraire posée par L'adhérent
                            sera donc caduque, quel que soit le mement ou elle aura pu être a sa
                            connaissance.
                    </p>
                    <p>
                        <span class="titleCondition" style="text-decoration: underline;">1-OBJET DU CONTRAT</span><br/><br/>
                        Aprés avoir visité les installations du club et /ou avoir pris
connaissance des prestations proposées, le Membre déclare souscrire
un contrat d'abonnement nominatif et incessible l'autorisant à utiliser
les installations en libre-service avec accés illimité aux jours et heures
d'ouvertures du club dans le cadre du forfait de base comprenant :
Cardio-training et musculation, selon un prix et des modalités
financiéres indiqués dans le présent contrat.
                    </p>
                    <p>
                        <span class="titleCondition" style="text-decoration: underline;">2-DEFINITION</span><br/><br/>
                        La CARTE du membre est à durée détarminée suivant le durée
souscrite au départ du contrat. En cas de prélèvement, l'arrêt de celui
ci intervient des l'échéance suivant la contrat.
En cas de perte ou de vol, le remplacemebt de sa carte sera facture
100 SH TTC a l'abonné.
Le renouvellemnt fait l'objet d'un nouveau contrat
                    </p>
                </p>
                <p>
                    <span class="titleCondition"  style="text-decoration: underline;">3-GARANTIE DU PRIX</span><br/><br/>
                    Pendant toute la durée du contrat, le prix fixé aux présentes est garanti
(en Dirhams constants). En cas d'interruption du contrat a l'initiative du
membre (a l'exclusion d'une interruption a l'iniyiative du club) et quelle
qu'en soit la cause ou la durée, le club se réserve la possibilté
d'actualiser, le cas échéant, le prix de l'abonnement mensuel lors de la
réactivation de contrat.
                </p>
                <p>
                    <span class="titleCondition"  style="text-decoration: underline;">4-MODALITES DE RESIATION</span><br/><br/>
                    A l'initiative du Membre :<br/>
La demande de résiliation à l'initiative du membre, est possible à
compter du 11éme mois effectif de l'abonnement, et doit être sgnifiée,
par courrier recommandé avec avis de réception, avec un préavis d'un
mois. Poue être validitée définitivement, la résiliation doit être suivie, au
terme du mois de préavis, de la restitution de la carte de Membre au
club. A défaut, les réglementx mensuels ou les prélèvements
contnuent d'être effectues jusqu'à remise de la carte du membre. En
cas de résiliation du contrat par le membre relevant de la force majeure
pendant la période incompressible des 12 premiers mois, les frais
administratifs seront d'un montant forfaitaire de 1900,00 DH, et seront
prélevés en une seule fois pour clôture du dossier. Par motif de cas de
force majeure, il est limitativement fait réfèrence aux cas suivants :
maladie ou accident grave empéchant défnitivement le Membre de
bénéficier des services du club, décés, mutation professionnelle du fait
de l'employeur.<br/>
Pour toute autre cause d'empêchement non définitve (supérieue à 2
mois), le Membre pourra bénéficier d'une suspension d'abonnement à
la condition expresse d'informer le club préalablement et remettre sa
carte ainsi que les piéces justificatives.<br/><br/>
A l'initiative du Club :<br/>
L'abonnement est résilié de plein droit par le club aux motifs suivants :
- En cas de fraude dans la constitution du dossier d'abonnement,
fausse déclaration, faisification des piéces.<br/>
- En cas de fraude dans l'utilisation de la carte d'accés du club.<br/>
- En cas de défaut de paiement, étant précisé qu'un premier incident<br/>
de paiement donne lieu à la suspension de la carte d'abonnement du
club en attendant la régularisation. Le réglement s'effectuera aupres de
notre comptoir de commercialisation. En cas de 2 incidents ou plus de
paiements l'adhérent sera redevable des mois restants jusqu'au
douziémé mois et devra s'acquitter de sa dette auprés de notre service
de recouvrement avec la tarification en vigueur.
                </p>
                <p>
                    <span class="titleCondition"  style="text-decoration: underline;">5-REGLEMENT INTERIEUR/REGLES DE SECURITE ET HYGIENE</span><br/><br/>
                        Le Membre déclare se conformer aux conditions générales et au
                        présent réglement intérieur, y adhérer sans restriction ni réserve et de
                        respecter les consignes suivantes :<br/>
                        - Présence des enfants non inscrits aux kids club exclue dans
                        l'enceinte du club pour des raisons de sécuriié.<br/>
                        - L'interdication de fumer à l'intérieur et devant la porte de
                        l'établissement.<br/>
                        - Le port de vêtements et de chaussures de sport spécifiques et
                        exclusifs de toutes autres utilisations.<br/>
                        - La salle de cours collectif est strictement réservée aux cours
                        collectfs.<br/><br/>
                        - Le Membre s'engage à n'utiliser que le matériel et les équipements
                        mis à disposition par la salle et ne sont pas autorisés à ramener ses
                        propres affaires (corde à sauter, etc....).<br/>
                        - L'emploi d'une serviette sur les appareils et tapis de sol.<br/>
                        - Nettoyer sa place et son matériel aprés utilisation au moyen des
                        produits de nettoyage prévu à cet effet.<br/>
                </p>
                </td>
                <td class="conditions" style="padding-left : 10px;">
                    <p>
                        - Ranger le matériel aprés utilisation et décharger les barres et appareil
                        aprés chaque utilisation.<br/>
                        - La nourriture est interdite dans les salles d'entraînement.<br/>
                        - Chaque membre s'engage en cas d'accident dont il serait témoin à
                        alerter immédiatement les secours.<br/>
                        - Accés interdit à la pelouse du terrain lors de l'utilisation de la piste
                        d'athlétisme.<br/>
                        Les personnes extérieures, bénéficiant d'une invitation du club ou
                        d'une séance découverte sont soumises au même réglement que les
                        membres inscrits, et devront déposer obligatoirement une piéce
                        d'identité pendant leur séance et uniquement sur RDV.
                    </p>
                    <p>
                        <span class="titleCondition"  style="text-decoration: underline;">6-VESTIARES/DEPOT</span><br/><br/>
                        Le Membre peut utiliser des casies individuels à fermeture
traditionnelle dont l'utilisation est limitée à la durée de la séance.
En cas d'utilisation par le Membre d'un casier individuel à fermeture
traditionnelle, il lui est expressement rappelé l'obligation de se pourvoir
d'un cadenas de sécurité afin de pouvoir le fermer. Le cadenas est et
reste la propriéte du Membre. II est rappelé expressement au Membre
que les vestiares ne font l'objet d'aucune surveillance spécifique. Le
Membre reconnaît ainsi avoir été parfaitement informé des risques
encourus par le fait de placer des objets de valeur dans les vestiaires
communs, ce qui en aucune façon ne engager la responsabilité du
club. II est strictement interdit de laisser ses affaires personnelles à
l'intérieur des casies aprés avoir quité le club car les cadenas seront
automatiquement coupés et enlevés, sans aucune indemnisation pour
le membre. Une pénalité de 50 Dhs sera éxigée.
                    </p>
                    <p>
                        <span class="titleCondition"  style="text-decoration: underline;">7-ATTESTATION/CERTIFICAT MEDICAL/DECHARGE
                            MEDICALE</span><br/><br/>
                        Le Membre atteste que sa constitution physique et son état de santé lui
permettent de pratiquer le sport en général, et plus particuliérement
d'utiliser les services, les activités, le matériel et les installations
proposés par le club : musculation, cardio-training, cours collectifs de
fitness et activités annexes, qu'il ne souffre d'aucune blessure,
maladie ou handicap, qu'il n'a jamais eu de problémes cardiaques ou
respirations décelés à ce jour.<br/>
Aucun médecin, infirmier, entraîneur, ne lui a déconseillé la pratique de
cette activité.<br/>
Le Membre remet le jour de la signature du contrat, un certificat
d'aptitude à la pratque des activités proposées par le club. A défaut de
certificat médical, le Membre décharge le club, ses responsables, le(s)
professeur(s), ses membres, de toutes réclamations, actions juridiques,
frais, dépenses et requêtes respectivement à des blessures ou
dommages occasionnés à sa personne et causés de quelque maniére
que ce soit, découlant ou en raison du fait qu'il pratique cette activité
sportive, et ce nonobstant le fait que cela ait pu être causé ou
occasionné par négligence ou être lié à un manquement à ses
responsabilités à titre d'occupant des lieux. Le Membre consent à
assumer tous les risques connus et inconnus, et toutes les
conséquences afférentes ou liées au fait qu'il participe aux activités
sportives du club. En outre, le(s) parent(s) ou le(s) titeur(s) légal (aux)
des participants mineurs de moins de 18 ans accepte(nt) de
communiquer aux dits participants mineurs les avertissements et les
conditions mentionnés ci-dessus, ainsi que leurs conséquences et
consent(ent) à la participation des dits mineur(s). Le Membre atteste
avoir lu le présent document comprend qu'en y apposant sa signature il
renonce à des droits importants C'est donc en toute connaissance de
cause qu'il signe la présente décharge médicale.
                    </p>
                    <p>
                        <span class="titleCondition"  style="text-decoration: underline;">8-RESPONSABILITE CIVILE/DOMMAGE CORPOREL</span><br/><br/>
                        Le club est assuré pour les dommages engageant sa responsabilité
                        civile et celle de son personnel conformément aux dispositions légales.
                        Cette assurance a pour objet de garantir le club contre les
                        conséquences pécunaires de la responsabilité civile encourues au titre
                        des dommages causés à autrui du fait de l'exploitation : dommages
                        corporels, matériels, immatériels.
                        La responsabilité du club ne pourra être recherchée en cas d'accident
                        résultant de l'inobservation des consignes de sécurité ou de l'utilisation
                        inappropriée des appareils ou autres installations.
                        De son côté, le Membre est invité à souscrire une police d'assurance
                        Responsabilité Civile personnelle, et une police d'assurance pour la
                        pratque du sport, ayant pour objet de lui proposer des garanties
                        susceptibles de réparer les atteintes a l'intégralité physique dont il
                        pourrait être victime en cas de dommage corparels ou d'accident.
                    </p>
                    <p>
                        <span class="titleCondition"  style="text-decoration: underline;">9 - Interruption dans l'exploitation</span><br/><br/>
                        L'exploitation du club pourra être interrempue par décision de
l'administation du club Fit Gouse au cas ou une cérémonie officielle ou
toutes autres manifestations, ou l'exécution de travaux l'exigerait.
L'exploitant ne pourra recevoir aucune indemnité à condition que cette
neutralisation n'ait pas une durée supérieure à 15 jours.
                    </p>
                </td>
            </table>
        </td>
     </tr>
</body>
</html>
`
    );

    printWindow.document.close();
    printWindow.print();
  }
}
