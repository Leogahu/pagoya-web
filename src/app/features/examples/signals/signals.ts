import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-signals',
  imports: [],
  templateUrl: './signals.html',
  styleUrl: './signals.css',
})
export class Signals {
   contador = signal(0);

   incrementar() {
     this.contador.update((valor) => valor + 1);
   }

   resetear() {
     this.contador.set(4);
   }

}
