import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(path);
    if (error) throw error;
    return data;
  }
}
