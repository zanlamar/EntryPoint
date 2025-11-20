import { Component, OnInit, Input, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EventWithStats } from '../../core/models/event.model';

@Component({
  selector: 'app-table-view',
  imports: [CommonModule, TableModule],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
  standalone: true
})

export class TableView {
  @Input() events!: Signal<EventWithStats[]>;

constructor(
) {}

}