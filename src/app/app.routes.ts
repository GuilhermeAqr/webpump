import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  { path: '', redirectTo: 'acesso-lgpd', pathMatch: 'full' },
  {
    path: 'acesso-lgpd',
    loadComponent: () =>
      import('./pages/acesso-lgpd/acesso-lgpd.component').then(
        (m) => m.AcessoLgpdComponent
      ),
    title: 'WebPump Vet · Acesso & LGPD',
  },
  {
    // Layout protegido: aside + header + footer, com <router-outlet> para as
    // páginas clínicas. O authGuard aqui garante que NENHUMA rota-filha seja
    // acessada sem sessão de veterinário autenticado.
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'paciente-vet',
        loadComponent: () =>
          import('./pages/paciente-vet/paciente-vet.component').then(
            (m) => m.PacienteVetComponent
          ),
        title: 'WebPump Vet · Paciente Vet',
      },
      {
        path: 'modalidade-de-infusao',
        loadComponent: () =>
          import(
            './pages/modalidade-infusao/modalidade-infusao.component'
          ).then((m) => m.ModalidadeInfusaoComponent),
        title: 'WebPump Vet · Modalidade de Infusão',
      },
      {
        path: 'protocolo-farmacologico',
        loadComponent: () =>
          import(
            './pages/protocolo-farmacologico/protocolo-farmacologico.component'
          ).then((m) => m.ProtocoloFarmacologicoComponent),
        title: 'WebPump Vet · Protocolo Farmacológico',
      },
      {
        // A página original "Farmacologia & Simulador de Bomba" atende, no
        // mesmo conteúdo, os itens 3 (Protocolo Farmacológico) e 4
        // (Simulador & Monitor) do menu lateral — por isso ambos convergem
        // para o mesmo componente/rota.
        path: 'simulador-de-bomba',
        redirectTo: 'protocolo-farmacologico',
        pathMatch: 'full',
      },
      { path: '', redirectTo: 'paciente-vet', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'acesso-lgpd' },
];
