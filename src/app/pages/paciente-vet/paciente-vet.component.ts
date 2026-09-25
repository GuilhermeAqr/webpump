import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PatientDataService } from '../../core/services/patient-data.service';

type Species = 'canine' | 'feline' | 'exotics';
type Sex = 'macho' | 'femea';
type WeightUnit = 'kg' | 'g';
type Porte = 'mini' | 'pequeno' | 'medio' | 'grande' | 'gigante';

interface LifeStage {
  pill: string;
  pillClass: string;
  desc: string;
}

interface EccInfo {
  title: string;
  desc: string;
}

/** Taxas hídricas basais (mL/kg/dia) por espécie — igual ao script original. */
const BASAL_RATES: Record<Species, number> = {
  canine: 60,
  feline: 50,
  exotics: 75,
};

const PORTE_LABELS: Record<Porte, string> = {
  mini: 'Porte Mini (< 5 kg)',
  pequeno: 'Porte Pequeno (5kg a 10kg)',
  medio: 'Porte Médio (10kg a 25kg)',
  grande: 'Porte Grande (25kg a 45kg)',
  gigante: 'Porte Gigante (> 45kg)',
};

const ECC_DATA: Record<number, EccInfo> = {
  1: { title: 'ECC 1/9 (Muito Caquético)', desc: 'Costelas, vértebras e ossos pélvicos proeminentes à distância. Nenhuma gordura palpável.' },
  2: { title: 'ECC 2/9 (Muito Magro)', desc: 'Ossos facilmente visíveis. Perda acentuada de massa muscular.' },
  3: { title: 'ECC 3/9 (Magro)', desc: 'Costelas facilmente palpáveis com mínimo recobrimento adiposo.' },
  4: { title: 'ECC 4/9 (Abaixo do Ideal)', desc: 'Costelas facilmente palpáveis com fina camada de gordura. Cintura evidente.' },
  5: { title: 'ECC 5/9 (Ideal)', desc: 'Costelas palpáveis sem excesso de gordura. Cintura bem delineada.' },
  6: { title: 'ECC 6/9 (Sobrepeso Leve)', desc: 'Costelas palpáveis com discreto excesso de gordura. Cintura ainda discernível.' },
  7: { title: 'ECC 7/9 (Sobrepeso)', desc: 'Dificuldade para palpar costelas por espessa camada de gordura.' },
  8: { title: 'ECC 8/9 (Obeso)', desc: 'Costelas não palpáveis sob espessa capa de gordura. Distensão abdominal visível.' },
  9: { title: 'ECC 9/9 (Obesidade Mórbida)', desc: 'Depósitos massivos de gordura em tórax, coluna e base da cauda.' },
};

const SPECIE_ICON: Record<Species, string> = {
  canine: 'sound_detection_dog_barking',
  feline: 'cruelty_free',
  exotics: 'fluid_med',
};

const SPECIE_TEXT: Record<Species, string> = {
  canine: 'Canino',
  feline: 'Felino',
  exotics: 'Pequenos Animais',
};

@Component({
  selector: 'app-paciente-vet',
  standalone: true,
  templateUrl: './paciente-vet.component.html',
})
export class PacienteVetComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly patientData = inject(PatientDataService);

  // ----- Estado clínico reativo do paciente (equivalente ao `state` original) -----
  species: Species = 'canine';
  weight = 14.5;
  unit: WeightUnit = 'kg';
  years = 4;
  months = 6;
  ecc = 5;
  hydrationPercent = 0;
  sex: Sex = 'macho';
  petName = 'Thor';
  tutorName = 'Mariana Silva';
  selectedPorte: Porte = 'medio';

  readonly porteOptions: { key: Porte; peso: number; label: string }[] = [
    { key: 'mini', peso: 3.5, label: 'Mini (< 5 kg)' },
    { key: 'pequeno', peso: 7.5, label: 'Pequeno (5–10 kg)' },
    { key: 'medio', peso: 14.5, label: 'Médio (10–25 kg)' },
    { key: 'grande', peso: 32.0, label: 'Grande (25–45 kg)' },
    { key: 'gigante', peso: 52.0, label: 'Gigante (> 45 kg)' },
  ];

  // ----- Seleção de espécie / porte -----
  setSpecies(sp: Species): void {
    this.species = sp;
  }

  selectPorte(porte: Porte, defaultWeight: number): void {
    this.selectedPorte = porte;
    this.setWeight(defaultWeight);
  }

  get porteDesc(): string {
    return PORTE_LABELS[this.selectedPorte];
  }

  // ----- Peso (kg/g, stepper + slider) -----
  setWeight(val: number): void {
    let clean = val;
    if (isNaN(clean) || clean < 0.2) clean = 0.2;
    if (clean > 120) clean = 120;
    this.weight = parseFloat(clean.toFixed(1));
  }

  adjustWeight(delta: number): void {
    this.setWeight(this.weight + delta);
  }

  onWeightInputChange(event: Event): void {
    const raw = parseFloat((event.target as HTMLInputElement).value);
    const kgValue = this.unit === 'g' ? raw / 1000 : raw;
    this.setWeight(kgValue);
  }

  onWeightSliderChange(event: Event): void {
    const raw = parseFloat((event.target as HTMLInputElement).value);
    this.setWeight(raw);
  }

  toggleUnit(unit: WeightUnit): void {
    this.unit = unit;
  }

  get displayWeight(): number {
    return this.unit === 'kg' ? this.weight : Math.round(this.weight * 1000);
  }

  get weightGramsText(): string {
    return Math.round(this.weight * 1000).toLocaleString('pt-BR') + ' g';
  }

  // ----- Sexo -----
  setSex(sex: Sex): void {
    this.sex = sex;
  }

  // ----- Idade / fase de vida -----
  onYearsChange(event: Event): void {
    this.years = parseInt((event.target as HTMLInputElement).value, 10) || 0;
  }

  onMonthsChange(event: Event): void {
    this.months = parseInt((event.target as HTMLInputElement).value, 10) || 0;
  }

  get lifeStage(): LifeStage {
    const totalMonths = this.years * 12 + this.months;
    if (totalMonths <= 6) {
      return {
        pill: 'Pediátrico / Filhote',
        pillClass: 'px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-code text-label-code font-bold',
        desc: 'Atenção: Maior fração hídrica corporal e menor reserva glicêmica.',
      };
    }
    if (totalMonths <= 24) {
      return {
        pill: 'Jovem / Adulto Inicial',
        pillClass: 'px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-code text-label-code font-bold',
        desc: 'Capacidade de compensação hídrica fisiológica ótima.',
      };
    }
    if (totalMonths <= 96) {
      return {
        pill: 'Adulto Maduro',
        pillClass: 'px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-code text-label-code font-bold',
        desc: 'Metabolismo hídrico e clearance renal estabilizados.',
      };
    }
    return {
      pill: 'Geriátrico / Sênior',
      pillClass: 'px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-code text-label-code font-bold',
      desc: 'Cuidado redobrado com sobrecarga cardíaca e taxa de filtração glomerular.',
    };
  }

  // ----- Escore de Condição Corporal -----
  onEccChange(event: Event): void {
    this.ecc = parseInt((event.target as HTMLInputElement).value, 10);
  }

  get eccInfo(): EccInfo {
    return ECC_DATA[this.ecc];
  }

  // ----- Hidratação -----
  onHydrationChange(event: Event): void {
    this.hydrationPercent = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  // ----- Cálculo principal (Superfície Corporal / BSA + infusão) -----
  /** Fórmula de Meeh: BSA = (K * Peso(g)^(2/3)) / 10000. K=10.1 cão, 10.0 gato, 9.8 outros. */
  get bsa(): number {
    const k = this.species === 'feline' ? 10.0 : this.species === 'canine' ? 10.1 : 9.8;
    const weightGrams = this.weight * 1000;
    return (k * Math.pow(weightGrams, 2 / 3)) / 10000;
  }

  get basalRateFactor(): number {
    return BASAL_RATES[this.species];
  }

  get dailyVolume(): number {
    return Math.round(this.weight * this.basalRateFactor);
  }

  get ratePerHour(): string {
    return (this.dailyVolume / 24).toFixed(1);
  }

  get macroDrops(): number {
    return Math.round((parseFloat(this.ratePerHour) * 20) / 60);
  }

  /** Reposição de déficit hídrico: Peso(kg) * %desidratação * 10 = Volume em mL. */
  get deficitVol(): number {
    return Math.round(this.weight * this.hydrationPercent * 10);
  }

  get specieIcon(): string {
    return SPECIE_ICON[this.species];
  }

  get specieText(): string {
    return SPECIE_TEXT[this.species];
  }

  // ----- Navegação -----
  goBack(): void {
    this.location.back();
  }

  goToStep3(): void {
    this.patientData.save({
      species: this.species,
      weight: this.weight,
      years: this.years,
      months: this.months,
      ecc: this.ecc,
      hydrationPercent: this.hydrationPercent,
      sex: this.sex,
      petName: this.petName || 'Paciente',
      tutorName: this.tutorName || 'Responsável não informado',
      bsa: this.bsa.toFixed(3),
      dailyVolume: String(this.dailyVolume),
      hourlyRate: this.ratePerHour,
      timestamp: new Date().toISOString(),
    });
    this.router.navigate(['/modalidade-de-infusao']);
  }
}
