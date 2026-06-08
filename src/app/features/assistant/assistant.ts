import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-assistant',
  imports: [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './assistant.html',
  styleUrl: './assistant.css',
})
export class Assistant {
  draft = '';

  suggestions = [
    '¿Cuál es mi saldo total?',
    'Resume mis gastos del mes',
    '¿Cómo hago una transferencia?',
  ];

  messages: Message[] = [
    { from: 'bot', text: '¡Hola! Soy tu asistente de PagoYa. ¿En qué te puedo ayudar hoy?' },
  ];

  send(text: string = this.draft): void {
    const value = text.trim();
    if (!value) return;
    this.messages.push({ from: 'user', text: value });
    this.messages.push({ from: 'bot', text: 'Estoy en modo demo todavía, pronto podré responderte de verdad.' });
    this.draft = '';
  }
}
