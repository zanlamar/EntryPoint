import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Footer } from '../../shared/components/footer/footer'; 
import { AuthService } from '../../core/services/auth.service'; 
import { EventService } from '../../core/services/event.service';   
import { StorageService } from '../../core/services/storage.service';
import { EventFormDTO } from '../../core/models/event.model';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
@Component({
  selector: 'app-event-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatStepperModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatButtonModule, 
    MatRadioModule, 
    MatTimepickerModule, 
    Footer, 
    FormsModule, 
    DatePicker,
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  standalone: true
})
export class EventForm implements OnInit {
  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;
  step3FormGroup: FormGroup;
  step4FormGroup: FormGroup;
  selectedFileName = '';
  isEditMode = signal(false);
  currentEventId = signal<string | null>(null);
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private eventService: EventService,
    private storageService: StorageService
  ) {
    this.step1FormGroup = this.formBuilder.group({
      eventTitle: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.step2FormGroup = this.formBuilder.group({
      eventDateTime: ['', Validators.required]
    });
    this.step3FormGroup = this.formBuilder.group({
      location: ['', Validators.required],
    });
    this.step4FormGroup = this.formBuilder.group({
      image: ['', Validators.required],
      allowedPlusOne: [false, Validators.required],
      bringList: ['']
    });
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.currentEventId.set(id);
        this.loadEventForEdit(id);
      } else {
        this.isEditMode.set(false);
        this.currentEventId.set(null);
      }
    })
  }
  async onFileSelected(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      this.selectedFileName = file.name;
      try {
        const imageUrl = await this.storageService.uploadImage(file);
        this.step4FormGroup.patchValue({ image: imageUrl });
        console.log('Imagen subida:', imageUrl);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  async onSubmit() {

