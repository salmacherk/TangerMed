import { Request, Response } from 'express';
import { getRepository,In } from 'typeorm';
import { Ouvrage } from '../entity/Ouvrage';
import { Document } from '../entity/Document';
import { v4 as uuidv4 } from 'uuid';
import { Portfolio } from '../entity/Portfolio';

export class OuvrageController {

  async createDocumentsForOuvrage(req: Request, res: Response): Promise<Response> {
    try {
      const ouvrageRepository = getRepository(Ouvrage);
      const documentRepository = getRepository(Document);
  
     
      const ouvrage = await ouvrageRepository.findOne(req.params.ouvrageId);
      if (!ouvrage) {
        return res.status(404).json({ message: 'Ouvrage not found' });
      }
  
      const portfolio = ouvrage.portfolio;
      const ouvrageId=ouvrage.id;
     
      if (!Object.values(Portfolio).includes(portfolio)) {
        return res.status(400).json({ message: 'Invalid portfolio value' });
      }
  
      const files = req.files as Express.Multer.File[];
  
      const documents = files.map(file => documentRepository.create({
        chemin: `ouvrage/${portfolio}/${ouvrageId}/${file.filename}`,
        nomOrigine: file.originalname,
        nouveauNom: `${uuidv4()}_${file.originalname}`,
        dateInsertion: new Date(),
        ouvrage,
        portfolio: portfolio,
      }));
  
      await documentRepository.save(documents);
      return res.status(201).json(documents);
    } catch (error) {
      console.error('Erreur lors de la création des documents pour Ouvrage:', error);
      return res.status(500).json({ message: 'Erreur lors de la création des documents pour Ouvrage' });
    }
  }

  async getOuvrages(req: Request, res: Response): Promise<Response> {
    try {
      const ouvrageRepository = getRepository(Ouvrage);
      const { portfolios } = req.query;
  
      let ouvrages;
      if (portfolios) {
        const portfolioArray = (portfolios as string).split(',');
        ouvrages = await ouvrageRepository.find({
          where: {
            portfolio: In(portfolioArray)
          },
          relations: ['documents']
        });
      } else {
        ouvrages = await ouvrageRepository.find({ relations: ['documents'] });
      }
  
      return res.status(200).json(ouvrages);
    } catch (error) {
      console.error('Erreur lors de la récupération des ouvrages:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des ouvrages.' });
    }
  }
}
