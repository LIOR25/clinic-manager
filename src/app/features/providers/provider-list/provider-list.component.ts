import { Component, computed, inject } from '@angular/core';
import { ProviderService } from '../../../core/services/provider.service';
import { CardComponent } from '../../../shared/components/card/card.component';


@Component({
  selector: 'app-provider-list',
  imports: [CardComponent],
  templateUrl: './provider-list.component.html',
  styleUrl: './provider-list.component.scss'
})
export class ProviderListComponent {
  private providerService = inject(ProviderService);

  // Expose the signals from the service
  filteredProviders = this.providerService.filteredProviders;
  providers = this.providerService.providers;
  searchQuery = this.providerService.searchQuery;
  isLoading = this.providerService.loading;

  emptyStateMessage = computed(() =>
    this.searchQuery()
      ? `No providers found matching "${this.searchQuery()}"`
      : 'No providers found'
  );


  ngOnInit() {
    this.providerService.getProviders().subscribe();
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.providerService.searchQuery.set(target.value);
  }

}
