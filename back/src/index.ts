import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as path from 'path';
import routes from "./routes";

createConnection().then(async connection => {
 
   
    const app = express();
    app.use(bodyParser.json());
   
    
    app.use(express.static('Stockage'));
   
    app.use(cors({
        origin:"*" 
    })); 

    app.use('/api', routes);
  
    app.listen(3000);

   

    console.log("Express server has started on port 3000. Open http://localhost:3000 to see results");

}).catch(error => console.log(error));
