import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  get vetNome(): string {
    return this.auth.session()?.nome || 'Médico Veterinário';
  }

  get crmv(): string {
    return this.auth.session()?.crmv || 'CRMV Ativo';
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/acesso-lgpd']);
  }
}
