import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-acesso-lgpd',
  standalone: true,
  templateUrl: './acesso-lgpd.component.html',
})
export class AcessoLgpdComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** 'login' ou 'register' — equivalente a `currentAuthMode` no script original. */
  mode: AuthMode = 'register';

  isSubmitting = false;
  consentError = false;

  switchAuthTab(mode: AuthMode): void {
    this.mode = mode;
    this.consentError = false;
  }

  handleProceed(
    vetName: string,
    vetCrmv: string,
    clinicName: string,
    vetEmail: string,
    vetPassword: string,
    lgpdConsent: boolean
  ): void {
    if (!lgpdConsent) {
      // Mesmo comportamento do alert() original: é mandatório aceitar a LGPD.
      this.consentError = true;
      alert(
        'É mandatório expressar ciência e concordância com as diretrizes da LGPD (Lei 13.709) para operar o sistema clínico.'
      );
      return;
    }
    this.consentError = false;

    if (!vetEmail || !vetPassword) {
      return;
    }

    this.isSubmitting = true;

    // Simula a "autenticação de credenciais clínicas" do protótipo original
    // (setTimeout de ~900ms antes de redirecionar).
    setTimeout(() => {
      this.auth.login({
        nome: this.mode === 'register' && vetName ? vetName : 'Médico Veterinário',
        email: vetEmail,
        crmv: this.mode === 'register' ? vetCrmv : undefined,
        clinica: this.mode === 'register' ? clinicName : undefined,
      });

      this.isSubmitting = false;

      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
      this.router.navigateByUrl(redirectTo || '/paciente-vet');
    }, 900);
  }
}
