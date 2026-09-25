import { Injectable, signal } from '@angular/core';

export interface VetSession {
  nome: string;
  email: string;
  crmv?: string;
  clinica?: string;
  autenticadoEm: string;
}

const STORAGE_KEY = 'webpump_vet_session';

/**
 * Serviço de autenticação client-side (mock).
 *
 * Não existe backend nesta entrega — o objetivo é demonstrar a proteção de
 * rotas (AuthGuard) e o fluxo de consentimento LGPD (Lei 13.709/2018) exigido
 * na página de Acesso. A sessão é mantida em sessionStorage, então persiste
 * durante a navegação SPA e é encerrada ao fechar a aba/navegador.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Sinal reativo com a sessão atual (ou null se deslogado). */
  readonly session = signal<VetSession | null>(this.readSession());

  private readSession(): VetSession | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as VetSession) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.session() !== null;
  }

  /** Autentica (login ou cadastro) e persiste a sessão do médico veterinário. */
  login(data: Omit<VetSession, 'autenticadoEm'>): void {
    const session: VetSession = { ...data, autenticadoEm: new Date().toISOString() };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* sessionStorage indisponível (modo privado, etc.) — segue apenas em memória */
    }
    this.session.set(session);
  }

  logout(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    this.session.set(null);
  }
}
