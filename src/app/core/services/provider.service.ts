import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal, computed } from "@angular/core";
import { map, tap, of, finalize } from "rxjs";
import { Provider } from "../models/provider.model";


@Injectable({providedIn: 'root'})
export class ProviderService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com';

  providers = signal<Provider[]>([]);
  searchQuery = signal<string>('');

  filteredProviders = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const providers = this.providers();

    if (!query) return providers;

    return providers.filter(provider =>
      provider.name.toLowerCase().includes(query) ||
      provider.phone.toLowerCase().includes(query) ||
      provider.clinicLocation.toLowerCase().includes(query)
    );
  });

  provider = signal<Provider | null>(null);
  loading = signal<boolean>(false);

  getProviders() {
    if (this.providers().length > 0) {
      return of(this.providers());
    }

    this.loading.set(true);
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map(providers => providers.map(provider => this.mapToProvider(provider))),
      tap(mappedProviders => {
        this.providers.set(mappedProviders);
      }),
      finalize(() => this.loading.set(false))
  )
}

  getProviderById(id: number) {
    const existing = this.providers().find(provider => provider.id === id);
    if (existing) {
      this.provider.set(existing);
      return of(existing);
    }

    this.loading.set(true);
    return this.http.get<any>(`${this.apiUrl}/users/${id}`).pipe(
      map(provider => this.mapToProvider(provider)),
      tap(mappedProvider => {
        this.provider.set(mappedProvider);
      }),
      finalize(() => this.loading.set(false))
    )
  }

  updateProvider(id: number, changes: Partial<Provider>) {
    this.loading.set(true);
    return this.http.patch(`${this.apiUrl}/users/${id}`, changes).pipe(
      tap(() => {
        this.provider.update(current => current ? { ...current, ...changes } : null);
        this.providers.update(list => list.map(provider => provider.id === id ? { ...provider, ...changes } : provider));
      }),
      finalize(() => this.loading.set(false))
    );
  }

  createProvider(provider: Partial<Provider>) {
    this.loading.set(true);
    return this.http.post<any>(`${this.apiUrl}/users`, provider).pipe(
      tap(newProvider => {
        // Calculate a unique ID based on existing providers to avoid conflicts with fake API
        const currentProviders = this.providers();
        const maxId = currentProviders.length > 0 ? Math.max(...currentProviders.map(provider => provider.id)) : 0;
        const newId = maxId + 1;

        // Merge the response but overwrite the ID with our generated one
        const created = { ...provider, ...newProvider, id: newId };
        this.providers.update(list => [...list, created]);
        this.provider.set(created);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  deleteProvider(id: number) {
    this.loading.set(true);
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => {
        this.providers.update(list => list.filter(provider => provider.id !== id));
        if (this.provider()?.id === id) {
          this.provider.set(null);
        }
      }),
      finalize(() => this.loading.set(false))
    );
  }

  private mapToProvider(data: any): Provider {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      clinicLocation: data.address?.city || data.clinicLocation,
      specialty: data.company?.bs || data.specialty,
      website: data.website
    };
  }
}
