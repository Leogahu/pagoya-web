import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface Arc extends DonutSlice {
  dash: number;
  rotate: number;
  pct: number;
}

@Component({
  selector: 'app-donut-chart',
  imports: [DecimalPipe],
  template: `
    <div class="donut">
      <svg viewBox="0 0 100 100" class="donut-svg" [style.width.px]="size()" [style.height.px]="size()">
        <circle class="track" cx="50" cy="50" [attr.r]="radius" fill="none" [attr.stroke-width]="thickness()" />
        @for (a of arcs(); track a.label) {
          <circle
            cx="50"
            cy="50"
            [attr.r]="radius"
            fill="none"
            [attr.stroke]="a.color"
            [attr.stroke-width]="thickness()"
            [attr.stroke-dasharray]="a.dash + ' ' + circumference"
            [attr.transform]="'rotate(' + a.rotate + ' 50 50)'"
            stroke-linecap="butt"
          />
        }
      </svg>
      <div class="donut-center">
        <span class="donut-total">{{ total() | number }}</span>
        <span class="donut-caption">{{ caption() }}</span>
      </div>
    </div>

    <ul class="legend">
      @for (a of arcs(); track a.label) {
        <li>
          <span class="dot" [style.background]="a.color"></span>
          <span class="legend-label">{{ a.label }}</span>
          <span class="legend-value">{{ a.value | number }} · {{ a.pct }}%</span>
        </li>
      }
    </ul>
  `,
  styles: `
    :host { display: flex; flex-direction: column; align-items: center; gap: 14px; }
    .donut { position: relative; display: inline-flex; }
    .donut-svg { transform: rotate(0deg); }
    .track { stroke: var(--color-surface-alt); }
    .donut-center {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .donut-total { font-size: 1.5rem; font-weight: 700; color: var(--color-text); line-height: 1; }
    .donut-caption { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-text-muted); }
    .legend { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .legend li { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .dot { width: 11px; height: 11px; border-radius: 3px; flex-shrink: 0; }
    .legend-label { color: var(--color-text-2); }
    .legend-value { margin-left: auto; color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
  `,
})
export class DonutChart {
  data = input<DonutSlice[]>([]);
  size = input(170);
  thickness = input(16);
  caption = input('Total');

  readonly radius = 40;
  readonly circumference = 2 * Math.PI * 40;

  total = computed(() => this.data().reduce((sum, s) => sum + s.value, 0));

  arcs = computed<Arc[]>(() => {
    const total = this.total();
    if (total <= 0) return [];
    let cumulative = 0;
    return this.data()
      .filter(s => s.value > 0)
      .map(s => {
        const fraction = s.value / total;
        const arc: Arc = {
          ...s,
          dash: fraction * this.circumference,

          rotate: cumulative * 360 - 90,
          pct: Math.round(fraction * 100),
        };
        cumulative += fraction;
        return arc;
      });
  });
}
