import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { ProviderService } from '../../../core/services/provider.service';

@Component({
  selector: 'app-provider-detail',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule],
  templateUrl: './provider-detail.component.html',
  styleUrl: './provider-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderDetailComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private providerService = inject(ProviderService);
  private fb = inject(FormBuilder);

  providerId = signal<number | null>(null);
  provider = this.providerService.provider;
  isLoading = this.providerService.loading;

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      specialty: [''],
      clinicLocation: [''],
      website: [''],
      phone: ['']
    });

    // Handle Auto-Save
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        filter(() => this.providerId() !== null),
        switchMap((values) => this.providerService.updateProvider(this.providerId()!, values)),
        takeUntilDestroyed()
      )
      .subscribe({
        error: (err) => console.error('Error updating provider', err),
      });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.providerId.set(Number(id));
      this.providerService.getProviderById(Number(id)).subscribe(data => {
        this.form.patchValue(data, { emitEvent: false });
      });
    } else {
      // Initialize empty provider for create mode
      this.providerService.provider.set({} as any);
    }
  }

  save(): void {
    const id = this.providerId();
    if (!id) {
      const data = this.form.value;
      if (data) {
        this.providerService.createProvider(data).subscribe({
          next: (newProvider) => {
            this.providerId.set(newProvider.id); // Switch to edit mode
          },
          error: (err) => console.error('Error creating provider', err)
        });
      }
    }
  }

  startNewProvider(): void {
    this.providerId.set(null);
    this.providerService.provider.set({} as any);
    this.form.reset();
  }

  deleteProvider(): void {
    const id = this.providerId();
    if (id && confirm('Are you sure you want to delete this provider?')) {
      this.providerService.deleteProvider(id).subscribe({
        next: () => {
          this.router.navigate(['/providers']);
        },
        error: (err) => console.error('Error deleting provider', err)
      });
    }
  }
}
