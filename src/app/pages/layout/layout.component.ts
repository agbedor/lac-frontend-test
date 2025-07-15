import { Component, Input, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // for ngModel two-way binding
import { ReactiveFormsModule } from '@angular/forms'; // optional, if you're using reactive forms

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  selectedPassenger = '1_adult';

  passengerOptions = [
    { value: '1_adult', label: 'select gender' },
    { value: '1_adult', label: '1 adult' },
    { value: '2_adults', label: '2 adults' },
    { value: 'custom', label: 'Custom...' }
  ];
  @Input() data: any[] = [];
  @Input() rowTemplate!: TemplateRef<any>;
}
