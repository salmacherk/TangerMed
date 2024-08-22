import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../../services/groupes.service';
import { OuvrageService } from '../../services/ouvrages.service';
import { ActifService } from '../../services/actifs.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BatimentService } from '../../services/batiment.service';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  uploadForm: FormGroup;
  groupId?: number;
  ouvrageId?: number;
  actifId?: number;
  batimentId?: number;
  portfolio!: string;
  formData: FormData = new FormData();
  fileList: File[] = [];

  constructor(
    private fb: FormBuilder,
    private groupeService: GroupeService,
    private ouvrageService: OuvrageService,
    private actifService: ActifService,
    private batimentService: BatimentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      files: [null]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.groupId = +params['groupeId'];
      this.ouvrageId = +params['ouvrageId'];
      this.actifId = +params['actifId'];
      this.batimentId = +params['batimentId'];
      this.portfolio = params['portfolio'];
     

      this.formData.append('portfolio', this.portfolio);
      if (this.groupId) this.formData.append('groupeId', this.groupId.toString());
      if (this.ouvrageId) this.formData.append('ouvrageId', this.ouvrageId.toString());
      if (this.actifId) this.formData.append('actifId', this.actifId.toString());
      if (this.batimentId) this.formData.append('batimentId', this.batimentId.toString());
      
    });
  }

  openFileSelector(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      Array.from(fileList).forEach(file => {
        this.formData.append('files', file, file.name);
        this.fileList.push(file);
      });
    }
  }

  removeFile(index: number): void {
    this.fileList.splice(index, 1);
    this.formData.delete('files'); 
    this.fileList.forEach(file => this.formData.append('files', file, file.name)); 
  }

  uploadDocuments(): void {
    if (this.actifId) {
      this.actifService.uploadDocuments(this.actifId, this.portfolio, this.formData).subscribe(
        (response) => {
          console.log('Documents uploaded successfully', response);
          this.router.navigate(['/actifs']);
        },
        (error) => console.error('Error uploading documents', error)
      );
    } else if (this.ouvrageId) {
      this.ouvrageService.uploadDocuments(this.ouvrageId, this.portfolio, this.formData).subscribe(
        (response) => {
          console.log('Documents uploaded successfully', response);
          this.router.navigate(['/ouvrages']);
        },
        (error) => console.error('Error uploading documents', error)
      );
    } else if (this.batimentId) {
      if (this.groupId) { 
        this.formData.append('groupeId', this.groupId.toString()); 
      }
      this.batimentService.uploadDocuments(this.batimentId, this.formData).subscribe(
        (response) => {
          console.log('Documents uploaded successfully', response);
          this.router.navigate(['/batiments']);
        },
        (error) => console.error('Error uploading documents', error)
      );
    } else if (this.groupId) {
      this.groupeService.uploadDocuments(this.groupId, this.portfolio, this.formData).subscribe(
        (response) => {
          console.log('Documents uploaded successfully', response);
          this.router.navigate(['/groupes']);
        },
        (error) => console.error('Error uploading documents', error)
      );
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.onFileChange({ target: { files } });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }
}
