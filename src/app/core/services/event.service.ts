import { Injectable, signal } from "@angular/core";
import { Event, EventFormDTO } from "../models/event.model";
import { AuthService } from "./auth.service";
import { mapEventFormDTOToSupabase, getSupabaseUserId, mapSupabaseResponseToEvent } from "../helpers-supabase/event.mapper";
import { StorageService } from "./storage.service";
import { EventDataService } from "./event-data.service";
import { SupabaseService } from "./supabase.service";
@Injectable({
    providedIn: 'root'
})
export class EventService {
    eventPreview = signal<EventFormDTO | null>(null);
    imageFilePreview: File | null = null;
    constructor(
        private authService: AuthService,
        private storageService: StorageService,
        private eventDataService: EventDataService,
        private supabaseService: SupabaseService
    ) { }   
    async createEvent(eventData: EventFormDTO, imageFile: File | null): Promise<Event> {

