import { Component } from '@angular/core';

type Drug1 = 'morfina' | 'fentanil' | 'metadona';
type Drug3 = 'cetamina_10' | 'cetamina_5';
type Drug4 = 'dexmedetomidina' | 'midazolam' | 'butorfanol' | 'furosemida';
type PumpMode = 'run' | 'paused' | 'stopped';
type TransientAction = 'purge' | 'bolus' | null;

/**
 * Porta fiel do "Protocolo Farmacológico & Simulador de Bomba" original:
 * composição da solução multimodal (MLK+) em 4 slots de fármacos, resumo de
 * preparo, e o painel de hardware virtual da bomba peristáltica (LCD, purge,
 * bolus, mute, start/pause/stop, exportação de PDF e impressão de etiqueta).
 *
 * O peso do paciente (Thor, 24,5 kg) é mantido fixo, exatamente como no
 * script original (`const patientWeight = 24.5`).
 */
@Component({
  selector: 'app-protocolo-farmacologico',
  standalone: true,
  templateUrl: './protocolo-farmacologico.component.html',
})
export class ProtocoloFarmacologicoComponent {
  readonly patientWeight = 24.5; // kg (Thor, Canino, Boxer)

  // ----- Configuração global -----
  bagVolume = 250;
  /** Taxa de fluxo basal fixa da bomba (mL/h), igual ao original. */
  readonly baseFlowRate = 28.3;

  // ----- Slot 1: Opioide -----
  drug1Type: Drug1 = 'morfina';
  drug1Dose = 0.2;

  // ----- Slot 2: Lidocaína (fármaco fixo, apenas dose editável) -----
  drug2Dose = 1.5;
  readonly drug2Conc = 20.0;

  // ----- Slot 3: Cetamina -----
  drug3Type: Drug3 = 'cetamina_10';
  drug3Dose = 0.6;

  // ----- Slot 4: Adjuvante opcional -----
  isSlot4Active = true;
  drug4Type: Drug4 = 'dexmedetomidina';
  drug4Dose = 1.0;

  // ----- Estado do simulador de bomba -----
  pumpMode: PumpMode = 'run';
  transientAction: TransientAction = null;
  isMuted = false;
  showExportToast = false;

  // ----- Handlers de formulário -----
  onBagVolumeChange(event: Event): void {
    this.bagVolume = parseFloat((event.target as HTMLSelectElement).value) || 250;
  }

  onDrug1TypeChange(event: Event): void {
    this.drug1Type = (event.target as HTMLSelectElement).value as Drug1;
  }

  onDrug1DoseChange(event: Event): void {
    this.drug1Dose = parseFloat((event.target as HTMLInputElement).value) || 0;
  }

  onDrug2DoseChange(event: Event): void {
    this.drug2Dose = parseFloat((event.target as HTMLInputElement).value) || 0;
  }

  onDrug3TypeChange(event: Event): void {
    this.drug3Type = (event.target as HTMLSelectElement).value as Drug3;
  }

  onDrug3DoseChange(event: Event): void {
    this.drug3Dose = parseFloat((event.target as HTMLInputElement).value) || 0;
  }

  onDrug4TypeChange(event: Event): void {
    this.drug4Type = (event.target as HTMLSelectElement).value as Drug4;
  }

  onDrug4DoseChange(event: Event): void {
    this.drug4Dose = parseFloat((event.target as HTMLInputElement).value) || 0;
  }

  toggleSlot4(): void {
    this.isSlot4Active = !this.isSlot4Active;
  }

  // ----- Cálculos de diluição (Constant Rate Infusion) -----
  /** Duração total da bolsa em horas, na taxa basal fixa. */
  get infusionDurationHours(): number {
    return this.bagVolume / this.baseFlowRate;
  }

  get drug1Conc(): number {
    return this.drug1Type === 'fentanil' ? 0.05 : 10.0;
  }

  get drug1ConcDecimals(): string {
    return this.drug1Conc.toFixed(this.drug1Type === 'fentanil' ? 2 : 1);
  }

  get drug1Vol(): number {
    const totalMg = this.drug1Dose * this.patientWeight * this.infusionDurationHours;
    return totalMg / this.drug1Conc;
  }

  get drug2Vol(): number {
    const totalMg = this.drug2Dose * this.patientWeight * this.infusionDurationHours;
    return totalMg / this.drug2Conc;
  }

  get drug3Conc(): number {
    return this.drug3Type === 'cetamina_10' ? 100.0 : 50.0;
  }

  get drug3Vol(): number {
    const totalMg = this.drug3Dose * this.patientWeight * this.infusionDurationHours;
    return totalMg / this.drug3Conc;
  }

  get drug4Conc(): number {
    switch (this.drug4Type) {
      case 'dexmedetomidina':
        return 0.5;
      case 'midazolam':
        return 5.0;
      case 'butorfanol':
        return 10.0;
      default: // furosemida
        return 10.0;
    }
  }

  get drug4Unit(): string {
    return this.drug4Type === 'dexmedetomidina' ? 'mcg/kg/h' : 'mg/kg/h';
  }

  get drug4Vol(): number {
    if (!this.isSlot4Active) return 0;
    if (this.drug4Type === 'dexmedetomidina') {
      const doseInMg = this.drug4Dose / 1000;
      const totalMg = doseInMg * this.patientWeight * this.infusionDurationHours;
      return totalMg / this.drug4Conc;
    }
    const totalMg = this.drug4Dose * this.patientWeight * this.infusionDurationHours;
    return totalMg / this.drug4Conc;
  }

  get totalDrugsVol(): number {
    return this.drug1Vol + this.drug2Vol + this.drug3Vol + (this.isSlot4Active ? this.drug4Vol : 0);
  }

  /** Macrogotas: 20 gotas/mL. Microgotas: 60 gotas/mL. */
  get macroDrops(): number {
    return Math.round((this.baseFlowRate * 20) / 60);
  }

  get microDrops(): number {
    return Math.round((this.baseFlowRate * 60) / 60);
  }

  // ----- Simulador de bomba (LCD, controles físicos) -----
  get lcdFlowRateDisplay(): string {
    if (this.transientAction === 'purge') return '999.0';
    if (this.transientAction === 'bolus') return '150.0';
    return this.baseFlowRate.toFixed(1);
  }

  get lcdStatusText(): string {
    if (this.transientAction === 'purge') return 'PURGANDO LINHA (PURGE)';
    if (this.transientAction === 'bolus') return 'BOLO EM CURSO (BOLUS)';
    if (this.pumpMode === 'run') return 'INFUNDINDO (RUN)';
    if (this.pumpMode === 'paused') return 'PAUSADA (STANDBY)';
    return 'PARADA / STOPPED';
  }

  get lcdStatusClass(): string {
    if (this.transientAction === 'purge') return 'text-sky-400 font-bold tracking-wider uppercase';
    if (this.transientAction === 'bolus') return 'text-amber-300 font-bold tracking-wider uppercase';
    if (this.pumpMode === 'run') return 'text-emerald-400 font-bold tracking-wider uppercase';
    if (this.pumpMode === 'paused') return 'text-amber-400 font-bold tracking-wider uppercase';
    return 'text-rose-500 font-bold tracking-wider uppercase';
  }

  get lcdDotClass(): string {
    if (this.pumpMode === 'run') return 'w-2 h-2 rounded-full bg-emerald-400';
    if (this.pumpMode === 'paused') return 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
    return 'w-2 h-2 rounded-full bg-rose-500';
  }

  get startBtnLabel(): string {
    if (this.pumpMode === 'run') return 'PAUSAR BOMBA';
    if (this.pumpMode === 'paused') return 'RETOMAR BOMBA';
    return 'INICIAR BOMBA';
  }

  get startBtnClass(): string {
    return this.pumpMode === 'paused'
      ? 'bg-amber-700 hover:bg-amber-600 text-white font-title-md text-title-md font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:translate-y-0.5'
      : 'bg-emerald-700 hover:bg-emerald-600 text-white font-title-md text-title-md font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:translate-y-0.5';
  }

  pumpToggleStart(): void {
    this.pumpMode = this.pumpMode === 'run' ? 'paused' : 'run';
  }

  pumpStopAction(): void {
    this.pumpMode = 'stopped';
  }

  pumpPurgeAction(): void {
    this.transientAction = 'purge';
    setTimeout(() => (this.transientAction = null), 1800);
  }

  pumpBolusAction(): void {
    this.transientAction = 'bolus';
    setTimeout(() => (this.transientAction = null), 2500);
  }

  pumpMuteAction(): void {
    this.isMuted = !this.isMuted;
  }

  get muteIcon(): string {
    return this.isMuted ? 'volume_off' : 'volume_up';
  }

  get muteIconClass(): string {
    return this.isMuted
      ? 'material-symbols-outlined text-[20px] text-amber-400'
      : 'material-symbols-outlined text-[20px] text-gray-300';
  }

  get muteLabel(): string {
    return this.isMuted ? 'ALARME MUTADO' : 'MUTAR ALARME';
  }

  // ----- Documentação -----
  exportPDF(): void {
    this.showExportToast = true;
    setTimeout(() => (this.showExportToast = false), 4000);
  }

  printLabel(): void {
    window.print();
  }
}
