import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Provider } from '../../../core/models/provider.model';


@Component({
  selector: 'app-card',
  imports: [RouterLink, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input({ required: true}) provider!: Provider;
}
