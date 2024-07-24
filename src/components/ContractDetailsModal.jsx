import React from 'react';
import { Table, Modal, Button } from 'antd';

const ContractDetailsModal = ({ isVisible, onClose, contract, onShowTransactions }) => {
  const detailColumns = [
    { title: 'Champ', dataIndex: 'property', key: 'property' },
    { title: 'Valeur', dataIndex: 'value', key: 'value' },
  ];

  const detailData = [
    { property: 'Informations Personnelles', value: '', key: 'section1' },
    { property: 'Nom Complet du Client', value: `${contract.client} ${contract.Prenom_client}`, key: 'fullName' },
    { property: 'Type', value: contract.type, key: 'type' },
    { property: 'Informations du Contrat', value: '', key: 'section2' },
    { property: 'Numéro de Contrat', value: contract.numcontrat, key: 'numcontrat' },
    { property: 'Date de Début', value: contract.date_debut, key: 'date_debut' },
    { property: 'Date de Fin', value: contract.date_fin, key: 'date_fin' },
    { property: 'Établissement', value: contract.etablissemnt, key: 'etablissemnt' },
    { property: 'Type d\'Abonnement', value: contract.abonnement, key: 'abonnement' },
    { property: 'Catégorie d\'Abonnement', value: contract.cat_abn, key: 'cat_abn' },
    { property: 'Informations Financières', value: '', key: 'section3' },
    { property: 'Réduction', value: `${contract.reduction} €`, key: 'reduction' },
    { property: 'Montant Restant', value: `${contract.reste} €`, key: 'reste' },
  ];

  return (
    <Modal
      title="Détails du Contrat Client"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Button
        type="primary"
        className="mb-5"
        onClick={() => onShowTransactions(contract.id_contrat)}
      >
        Afficher les transactions
      </Button>
      <Table
        columns={detailColumns}
        dataSource={detailData}
        pagination={false}
        size="small"
        className="mt-5"
      />
    </Modal>
  );
};

export default ContractDetailsModal;