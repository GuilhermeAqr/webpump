import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Protege as rotas clínicas (Paciente Vet, Modalidade de Infusão, Protocolo
 * Farmacológico/Simulador): só permite acesso a médicos veterinários com
 * sessão ativa (login/cadastro concluído em "Acesso & LGPD"). Caso contrário,
 * redireciona para a tela de acesso, preservando a URL de destino como
 * query param `redirectTo` para eventual retomada do fluxo.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/acesso-lgpd'], {
    queryParams: { redirectTo: state.url },
  });
};
