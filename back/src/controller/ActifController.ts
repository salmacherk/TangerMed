import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Actif } from '../entity/Actif';
import { Document } from '../entity/Document';
import { v4 as uuidv4 } from 'uuid';
import { Portfolio } from '../entity/Portfolio';

export class ActifController {

  async createDocumentsForActif(req: Request, res: Response): Promise<Response> {
    try {
      const actifRepository = getRepository(Actif);
      const documentRepository = getRepository(Document);
  
      
      const actif = await actifRepository.findOne(req.params.actifId);
      if (!actif) {
        return res.status(404).json({ message: 'Actif not found' });
      }
  
      const portfolio = actif.portfolio;
      const actifId =actif.id;
      
      if (!Object.values(Portfolio).includes(portfolio)) {
        return res.status(400).json({ message: 'Invalid portfolio value' });
      }
  
      const files = req.files as Express.Multer.File[];
  
      const documents = files.map(file => documentRepository.create({
        chemin: `actif/${portfolio}/${actifId}/${file.filename}`,
        nomOrigine: file.originalname,
        nouveauNom: `${uuidv4()}_${file.originalname}`,
        dateInsertion: new Date(),
        actif,
        portfolio: portfolio,
      }));
  
      await documentRepository.save(documents);
      return res.status(201).json(documents);
    } catch (error) {
      console.error('Erreur lors de la création des documents pour Actif:', error);
      return res.status(500).json({ message: 'Erreur lors de la création des documents pour Actif' });
    }
  }

  async getActifs(req: Request, res: Response): Promise<Response> {
    try {
      const actifRepository = getRepository(Actif);
      const { portfolios } = req.query;
  
      const queryBuilder = actifRepository.createQueryBuilder('actif')
        .leftJoinAndSelect('actif.documents', 'documents')
        .leftJoinAndSelect('actif.ouvrage', 'ouvrage')
        .leftJoinAndSelect('actif.groupe', 'groupe');
  
      if (portfolios) {
        const portfolioArray = (portfolios as string).split(',');
        queryBuilder.andWhere('actif.portfolio IN (:...portfolios)', { portfolios: portfolioArray });
      }
  
      const actifs = await queryBuilder.getMany();
      const result = actifs.map(actif => ({
        id: actif.id,
        nom: actif.nom,
        portfolio: actif.portfolio,
        documents: actif.documents,
        groupeId: actif.groupe ? actif.groupe.nom : null,
      }));
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des actifs:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des actifs.' });
    }
  }
  async getGroupesByActifId(req: Request, res: Response): Promise<Response> {
    try {
      const actifRepository = getRepository(Actif);
      
      // Récupération de l'actif par son ID
      const actif = await actifRepository.findOne(req.params.actifId, {
        relations: ['groupe'] // Chargement des relations du groupe
      });
      
      if (!actif) {
        return res.status(404).json({ message: 'Actif not found' });
      }
      
      // Extraction du groupe associé
      const groupe = actif.groupe;

      // Si aucun groupe n'est associé à l'actif
      if (!groupe) {
        return res.status(404).json({ message: 'No groupe found for this actif' });
      }

      // Retourner les informations du groupe
      return res.status(200).json(groupe);
    } catch (error) {
      console.error('Erreur lors de la récupération du groupe pour Actif:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération du groupe pour Actif.' });
    }
  }
}
