import * as path from 'path';
import * as fs from 'fs';
import * as multer from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';


const createDirectories = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};


const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
   
    const groupeId = req.body.groupeId;
    const ouvrageId = req.body.ouvrageId;
    const actifId = req.body.actifId;
    const portfolio = req.body.portfolio;
    const batimentId = req.body.batimentId;
    
    
    
    let dir = 'stockage';

   
    if (actifId) {
      dir += `/actif/${portfolio}/${actifId}`;
    } else if (ouvrageId) {
      
      dir += `/ouvrage/${portfolio}/${ouvrageId}`;
    }
    

      else if (batimentId) {
        if (groupeId) {
          dir += `/batiment/${batimentId}/groupe/${groupeId}`;
        } else {
          dir += `/batiment/${batimentId}`;
        } }
        else if (groupeId) {
      dir += `/groupe/${portfolio}/${groupeId}`;
   
    } else {
      dir += `/uploads`; 
    }


  
    createDirectories(dir);

    cb(null, dir);
  },

  
  filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const newFileName = `${uuidv4()}${ext}`;
    cb(null, newFileName);
  }
});


const upload = multer({ storage });

export default upload;
