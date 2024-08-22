import { Request, Response } from 'express';
import { getRepository,In } from 'typeorm';
import { Groupe } from '../entity/Groupe';
import { Document } from '../entity/Document';
import { v4 as uuidv4 } from 'uuid';
import { Portfolio } from '../entity/Portfolio';

export class GroupeController {

  async createDocumentsForGroupe(req: Request, res: Response): Promise<Response> {
    try {
      const groupeRepository = getRepository(Groupe);
      const documentRepository = getRepository(Document);
  
     
      const groupe = await groupeRepository.findOne(req.params.groupeId);
      if (!groupe) {
        return res.status(404).json({ message: 'Groupe not found' });
      }
  
      const portfolio = groupe.portfolio;
      const groupeId = groupe.id;
      
      if (!Object.values(Portfolio).includes(portfolio)) {
        return res.status(400).json({ message: 'Invalid portfolio value' });
      }
  
      const files = req.files as Express.Multer.File[];
  
      const documents = files.map(file => documentRepository.create({
        
        chemin: `groupe/${portfolio}/${groupeId}/${file.filename}`,
        nomOrigine: file.originalname,
        nouveauNom: `${uuidv4()}_${file.originalname}`,
        dateInsertion: new Date(),
        groupe,
        portfolio: portfolio, 
      }));
  
      await documentRepository.save(documents);
      return res.status(201).json(documents);
    } catch (error) {
      console.error('Erreur lors de la création des documents pour Groupe:', error);
      return res.status(500).json({ message: 'Erreur lors de la création des documents pour Groupe' });
    }
  }
  

   async getGroupes(req: Request, res: Response): Promise<Response> {
    try {
      const groupeRepository = getRepository(Groupe);
      const { portfolios } = req.query;

      let groupes;
      if (portfolios) {
        const portfolioArray = (portfolios as string).split(',');
        groupes = await groupeRepository.find({
          where: {
            portfolio: In(portfolioArray)
          },
          relations: ['documents']
        });
      } else {
        groupes = await groupeRepository.find({ relations: ['documents'] });
      }

      return res.status(200).json(groupes);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des groupes.' });
    }
  }
  
}
