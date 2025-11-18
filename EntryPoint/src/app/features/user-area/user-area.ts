import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableView } from '../table-view/table-view';
import { AuthService } from '../../core/services/auth.service';
import { EventService } from '../../core/services/event.service';
import { Event, EventWithStats } from '../../core/models/event.model';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-user-area',
  imports: [CommonModule, TableView, Footer, InputGroupModule, InputGroupAddonModule, InputTextModule, IconFieldModule, InputIconModule ],
  templateUrl: './user-area.html',
  styleUrl: './user-area.css',
  standalone: true
})
export class UserArea implements OnInit {
  authService = inject(AuthService);
  eventService = inject(EventService);  
  userEvents$ = signal<Event[]>([]);

  searchText$ = signal<string>('');  
  selectedDate$ = signal<Date | null>(null);
  sortField$ = signal<string>('eventDateTime');
  sortOrder$ = signal<1 | -1>(1); 

  
  filteredEvents$ = computed(() => {
    let events = [...this.userEvents$()];
    const search = this.searchText$().toLowerCase();
    
    if (search) {
      events = events.filter(event =>
        event.title?.toLowerCase().includes(search) || 
        event.description?.toLowerCase().includes(search) ||
        event.location?.alias?.toLowerCase().includes(search) 
      );
    }
    
    const selectedDate = this.selectedDate$();
    if (selectedDate) {
      events = events.filter(event => {
        const eventDate = new Date(event.eventDateTime);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    const field = this.sortField$();
    const order = this.sortOrder$();

    events.sort((a, b) => {
      const valueA = (a as any)[field];
      const valueB = (b as any)[field];
      if (valueA < valueB) return -1 * order;
      if (valueA > valueB) return 1 * order;
      return 0;
    });
    
    return events;
  });
  
  async ngOnInit(): Promise <void> {
    const events = await this.eventService.getLoggedUserEvents();
    this.userEvents$.set(events);
  }

  onSearch(text: string): void {
    this.searchText$.set(text);
  }

  onSort(field: string): void {
    if (this.sortField$() === field) {
      this.sortOrder$.set(this.sortOrder$() === 1 ? -1 : 1);
    } else {
      this.sortField$.set(field);
      this.sortOrder$.set(1);
    }
  }

  onDateChange(dateString: string): void {
    if (dateString) {
      this.selectedDate$.set(new Date(dateString));
    } else {
      this.selectedDate$.set(null);
    }
}

  onThisMonth(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.selectedDate$.set(firstDay);
  }

  onNextMonth(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    this.selectedDate$.set(firstDay);
  }

  onClearDate(input: HTMLInputElement): void {
    this.selectedDate$.set(null);
    input.value = '';
  }
}


