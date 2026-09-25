import { Injectable, signal } from '@angular/core';

export interface ClinicalDossier {
  species: 'canine' | 'feline' | 'exotics';
  weight: number;
  years: number;
  months: number;
  ecc: number;
  hydrationPercent: number;
  sex: 'macho' | 'femea';
  petName: string;
  tutorName: string;
  bsa: string;
  dailyVolume: string;
  hourlyRate: string;
  timestamp: string;
}

const STORAGE_KEY = 'webpump_patient_data';

/**
 * Mantém em memória (e em sessionStorage) o último dossiê clínico calculado
 * na etapa "Paciente Vet", para eventual reaproveitamento pelas etapas
 * seguintes (Modalidade de Infusão / Protocolo Farmacológico), replicando o
 * comportamento original de sessionStorage.setItem('webpump_patient_data', ...).
 */
@Injectable({ providedIn: 'root' })
export class PatientDataService {
  readonly dossier = signal<ClinicalDossier | null>(this.read());

  private read(): ClinicalDossier | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ClinicalDossier) : null;
    } catch {
      return null;
    }
  }

  save(data: ClinicalDossier): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* noop */
    }
    this.dossier.set(data);
  }
}
