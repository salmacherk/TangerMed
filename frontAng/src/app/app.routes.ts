import { Routes } from '@angular/router';

import { GroupesComponent } from './components/groupes/groupes.component';
import { OuvragesComponent } from './components/ouvrages/ouvrages.component';
import { ActifsComponent } from './components/actifs/actifs.component';

import { AddDocumentComponent } from './components/add-document/add-document.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './Auth/guard';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BatimentComponent } from './components/batiment/batiment.component';
import { SelectTypeComponent } from './components/select-type/select-type.component';
import { TreeComponent } from './components/tree/tree.component';

import { BatimentDetailsComponent } from './components/batiment-details/batiment-details.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'groupes', component: GroupesComponent,canActivate: [AuthGuard] },
    { path: 'ouvrages', component: OuvragesComponent,canActivate: [AuthGuard] },
    { path: 'batiments', component: BatimentComponent,canActivate: [AuthGuard] },
    { path: 'type', component: SelectTypeComponent,canActivate: [AuthGuard] },
    { path: 'actifs', component: ActifsComponent, canActivate: [AuthGuard] },
    { path: 'add-document', component: AddDocumentComponent,canActivate: [AuthGuard] },
    { path: 'documents', component: DocumentsComponent,canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'tree', component: TreeComponent,canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    
    { path: 'batiment-details', component: BatimentDetailsComponent,canActivate: [AuthGuard] },
];

