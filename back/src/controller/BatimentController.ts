import { Request, Response } from 'express';
import { getRepository,In } from 'typeorm';
import { Batiment } from '../entity/Batiment';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '../entity/Document';
import { Groupe } from '../entity/Groupe';

export class BatimentController {
  async getBatiments(req: Request, res: Response): Promise<Response> {
    try {
        const batimentRepository = getRepository(Batiment);
        const { sites } = req.query;

        let batiments;
        if (sites) {
            const siteArray = (sites as string).split(',');
            batiments = await batimentRepository.find({
                where: {
                    site: In(siteArray)
                },
                relations: ['documents'] 
            });
        } else {
            batiments = await batimentRepository.find({ relations: ['documents'] });
        }

        return res.status(200).json(batiments);
    } catch (error) {
        console.error('Erreur lors de la récupération des bâtiments:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des bâtiments.' });
    }
  }
  // Dans BatimentController
async getBatimentById(req: Request, res: Response): Promise<Response> {
  try {
    const batimentId = parseInt(req.params.batimentId, 10);
    const batiment = await getRepository(Batiment).findOne(batimentId, {
      relations: ['documents', 'groupes'],
    });

    if (!batiment) {
      return res.status(404).json({ message: 'Bâtiment non trouvé' });
    }

    return res.status(200).json(batiment);
  } catch (error) {
    console.error('Erreur lors de la récupération du bâtiment:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du bâtiment.' });
  }
}

  
  async createDocumentsForBatiment(req: Request, res: Response): Promise<Response> {
    try {
        const batimentRepository = getRepository(Batiment);
        const documentRepository = getRepository(Document);
        const groupeRepository = getRepository(Groupe);

        const batiment = await batimentRepository.findOne(req.params.batimentId);
        if (!batiment) {
            return res.status(404).json({ message: 'Batiment not found' });
        }

        const batimentId = batiment.id;
        let groupeId = req.body.groupeId;

        if (Array.isArray(groupeId)) {
            groupeId = groupeId[0];  
        }
        groupeId = groupeId ? groupeId.toString().trim() : null;

        const groupe = groupeId ? await groupeRepository.findOne(groupeId) : null;

        const files = req.files as Express.Multer.File[];

        const documents = await Promise.all(files.map(async (file) => {
            const chemin = groupe
                ? `batiment/${batimentId}/groupe/${groupeId}/${file.filename}`
                : `batiment/${batimentId}/${file.filename}`;

            const document = documentRepository.create({
                chemin,
                nomOrigine: file.originalname,
                nouveauNom: `${uuidv4()}_${file.originalname}`,
                dateInsertion: new Date(),
                batiment,
                groupe,
                portfolio: groupe ? groupe.portfolio : null
            });

            return document;
        }));

        await documentRepository.save(documents);
        return res.status(201).json(documents);
    } catch (error) {
        console.error('Erreur lors de la création des documents pour Batiment:', error);
        return res.status(500).json({ message: 'Erreur lors de la création des documents pour Batiment' });
    }
}

  async getAllSites(req: Request, res: Response): Promise<Response> {
    try {
      const batimentRepository = getRepository(Batiment);
  
      
      const sites = await batimentRepository
        .createQueryBuilder("batiment")
        .select("DISTINCT batiment.site")
        .getRawMany();
  
      
      const siteValues = sites.map(site => site.site);
  
      return res.status(200).json(siteValues);
    } catch (error) {
      console.error('Erreur lors de la récupération des sites:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des sites.' });
    }
  }
  async getGroupesByBatimentId(req: Request, res: Response) {
    const batimentId = parseInt(req.params.id, 10);

    try {
      const batimentRepository = getRepository(Batiment);
      const batiment = await batimentRepository.findOne(batimentId, { relations: ['groupes'] });

      if (!batiment) {
        return res.status(404).json({ message: 'Bâtiment non trouvé' });
      }

      return res.json(batiment.groupes);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des groupes', error });
    }
  }
  
}
