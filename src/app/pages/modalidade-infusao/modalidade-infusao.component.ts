import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

type ProtocolKey = 'fluido' | 'mlk' | 'flk';

const PROTOCOL_NAMES: Record<ProtocolKey, string> = {
  fluido: 'Fluidoterapia Padrão / Reposição',
  mlk: 'Protocolo MLK (Morfina + Lidocaína + Cetamina)',
  flk: 'Protocolo FLK (Fentanil + Lidocaína + Cetamina)',
};

/**
 * Porta fiel do carrossel de modalidades original (3 cards: Fluidoterapia,
 * MLK e FLK), incluindo a responsividade (1/2/3 cards visíveis conforme a
 * largura da tela) e a seleção clínica independente da navegação do
 * carrossel — exatamente como no script vanilla original.
 */
@Component({
  selector: 'app-modalidade-infusao',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './modalidade-infusao.component.html',
})
export class ModalidadeInfusaoComponent {
  /** Índice do card "em foco" para o carrossel (0=Fluido, 1=MLK, 2=FLK). Padrão: MLK (ótimo canino). */
  currentIndex = 1;

  /** Protocolo clinicamente selecionado (independe do card em foco no carrossel). */
  selectedProtocol: ProtocolKey = 'mlk';

  readonly cardCount = 3;

  private windowWidth =
    typeof window !== 'undefined' ? window.innerWidth : 1280;

  @HostListener('window:resize')
  onResize(): void {
    this.windowWidth = window.innerWidth;
  }

  /** Quantos cards ficam visíveis simultaneamente, conforme a largura da viewport. */
  get visibleCount(): number {
    if (this.windowWidth >= 1024) return 3;
    if (this.windowWidth >= 768) return 2;
    return 1;
  }

  get maxIndex(): number {
    return Math.max(0, this.cardCount - this.visibleCount);
  }

  get boundedIndex(): number {
    return Math.min(this.currentIndex, this.maxIndex);
  }

  get trackTransform(): string {
    return `translateX(-${this.boundedIndex * (100 / this.visibleCount)}%)`;
  }

  selectCard(index: number, protocol: ProtocolKey): void {
    this.selectedProtocol = protocol;
    this.currentIndex = index;
  }

  prevSlide(): void {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  nextSlide(): void {
    this.currentIndex = Math.min(this.cardCount - 1, this.currentIndex + 1);
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  get selectedProtocolLabel(): string {
    return PROTOCOL_NAMES[this.selectedProtocol];
  }
}
