import { Router } from 'express';

import { DocumentController } from './controller/DocumentController';
import { ActifController } from './controller/ActifController';
import { OuvrageController } from './controller/OuvrageController';
import { GroupeController } from './controller/GroupeController';
import upload from './Config/DocumentConfig';
import UserController from './controller/UserController';
import { authenticateToken } from './Midlware/AuthMidleware';
import { BatimentController } from './controller/BatimentController';


const routes = Router();


const documentController = new DocumentController();
const actifController = new ActifController();
const ouvrageController = new OuvrageController();
const groupeController = new GroupeController();
const batimentController = new BatimentController();


routes.get('/batiments',authenticateToken, batimentController.getBatiments.bind(batimentController));
routes.post('/batiments/:batimentId/documents', authenticateToken, upload.array('files'), batimentController.createDocumentsForBatiment.bind(batimentController));
routes.get('/batiments/sites', batimentController.getAllSites.bind(batimentController));
routes.get('/batiments/:id/groupes', batimentController.getGroupesByBatimentId);
routes.get('/batiments/:batimentId', batimentController.getBatimentById.bind(batimentController));

routes.post('/register', UserController.register);
routes.post('/login', UserController.login);



routes.get('/documents',authenticateToken, documentController.getDocuments.bind(documentController));
routes.get('/documents/download/:id',authenticateToken, documentController.downloadDocument.bind(documentController));
routes.delete('/documents/delete/:id',authenticateToken, documentController.deleteDocument.bind(documentController));



routes.get('/actifs',authenticateToken,actifController.getActifs.bind(actifController));
routes.post('/actifs/:actifId/documents', upload.array('files'), actifController.createDocumentsForActif.bind(actifController));
routes.get('/actifs/:actifId/groupes', actifController.getGroupesByActifId.bind(actifController));


routes.get('/ouvrages',authenticateToken, ouvrageController.getOuvrages.bind(ouvrageController)); 
routes.post('/ouvrages/:ouvrageId/documents',authenticateToken, upload.array('files'), ouvrageController.createDocumentsForOuvrage.bind(ouvrageController));


routes.get('/groupes',authenticateToken, groupeController.getGroupes.bind(groupeController)); 
routes.post('/groupes/:groupeId/documents',authenticateToken, upload.array('files'), groupeController.createDocumentsForGroupe.bind(groupeController));

export default routes;
