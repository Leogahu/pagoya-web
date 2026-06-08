import { Component, computed, input } from '@angular/core';

export interface BarItem {
  label: string;
  value: number;

  display?: string;
  color?: string;
}

interface Bar extends BarItem {
  width: number;
}

@Component({
  selector: 'app-bar-chart',
  template: `
    @if (bars().length === 0) {
      <p class="bar-empty">Sin datos para mostrar.</p>
    }
    <div class="bars">
      @for (b of bars(); track b.label) {
        <div class="bar-row">
          <span class="bar-label">{{ b.label }}</span>
          <div class="bar-track">
            <div class="bar-fill" [style.width.%]="b.width" [style.background]="b.color || defaultColor()"></div>
          </div>
          <span class="bar-value">{{ b.display ?? b.value }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .bars { display: flex; flex-direction: column; gap: 14px; }
    .bar-empty { color: var(--color-text-muted); text-align: center; padding: 20px 0; }
    .bar-row { display: grid; grid-template-columns: 90px 1fr auto; align-items: center; gap: 12px; }
    .bar-label { font-size: 0.85rem; color: var(--color-text-2); font-weight: 500; }
    .bar-track { height: 12px; background: var(--color-surface-alt); border-radius: 999px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 999px; min-width: 2px; transition: width 0.4s ease; }
    .bar-value { font-size: 0.85rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--color-text); }
  `,
})
export class BarChart {
  data = input<BarItem[]>([]);
  defaultColor = input('var(--color-primary)');

  bars = computed<Bar[]>(() => {
    const items = this.data();
    const max = Math.max(0, ...items.map(i => i.value));
    return items.map(i => ({
      ...i,
      width: max > 0 ? (i.value / max) * 100 : 0,
    }));
  });
}
