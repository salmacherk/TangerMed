import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Document } from '../entity/Document';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Groupe } from '../entity/Groupe';
import { Actif } from '../entity/Actif';
import { Ouvrage } from '../entity/Ouvrage';
import { Portfolio } from '../entity/Portfolio';  



export class DocumentController {

  async getDocuments(req: Request, res: Response): Promise<Response> {
    try {
        const { actifId, groupeId, ouvrageId, batimentId } = req.query;
        const documentRepository = getRepository(Document);

        let queryBuilder = documentRepository.createQueryBuilder('document')
            .leftJoinAndSelect('document.groupe', 'groupe')
            .leftJoinAndSelect('document.ouvrage', 'ouvrage')
            .leftJoinAndSelect('document.actif', 'actif')
            .leftJoinAndSelect('document.batiment', 'batiment');

        if (actifId) {
            queryBuilder.andWhere(
                `(document.actifId = :actifId OR document.groupeId IN ` +
                `(SELECT "id" FROM "groupe" WHERE "id" IN (SELECT "groupeId" FROM "actif" WHERE "id" = :actifId)) ` +
                `OR document.ouvrageId IN (SELECT "ouvrageId" FROM "actif" WHERE "id" = :actifId))`,
                { actifId }
            );
        }

        if (groupeId) {
            queryBuilder.andWhere('document.groupeId = :groupeId', { groupeId });
        }

        if (ouvrageId) {
            queryBuilder.andWhere('document.ouvrageId = :ouvrageId', { ouvrageId });
        }

        if (batimentId) {
          queryBuilder.andWhere('document.batimentId = :batimentId', { batimentId });

         
        }

        const documents = await queryBuilder.getMany();

        const result = documents.map(doc => ({
            id: doc.id,
            chemin: doc.chemin,
            nomOrigine: doc.nomOrigine,
            nouveauNom: doc.nouveauNom,
            dateInsertion: doc.dateInsertion,
            groupeNom: doc.groupe ? doc.groupe.nom : '-', 
            ouvrageNom: doc.ouvrage ? doc.ouvrage.nom : '-', 
            actifNom: doc.actif ? doc.actif.nom : '-', 
            batimentNom: doc.batiment ? doc.batiment.nom : '-',
            portfolio: doc.portfolio ? doc.portfolio : '-',
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des documents.' });
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const documentRepository = getRepository(Document);

    try {
        
        const document = await documentRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (document) {
      
          const filePath = path.join(__dirname, '../../Stockage', document.chemin);
            console.log('Attempting to delete file at:', filePath);

            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('File successfully deleted:', filePath);
            } else {
                console.error('File not found at:', filePath);
            }

            
            await documentRepository.remove(document);

            res.json({ message: 'Document deleted successfully' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du document', error });
    }
    
}
 
  
  
async downloadDocument(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const documentRepository = getRepository(Document);

  try {
    const document = await documentRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (document) {
      const filePath = path.join(__dirname, '../../Stockage', document.chemin);
      if (fs.existsSync(filePath)) {
        res.download(filePath, document.nouveauNom);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement du document', error });
  }
}

  
  
}
