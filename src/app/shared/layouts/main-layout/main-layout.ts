import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { CustomerService } from '../../../core/services/customer.service';

const CRUMBS: Record<string, string> = {
  '/app/dashboard': 'Inicio',
  '/app/accounts': 'Cuentas',
  '/app/accounts/new': 'Cuentas / Nueva',
  '/app/transfers': 'Transferencias',
  '/app/transfers/new': 'Transferencias / Nueva',
  '/app/reports/accounts': 'Reportes / Cuentas',
  '/app/reports/transfers': 'Reportes / Transferencias',
  '/app/assistant': 'Asistente IA',
  '/app/profile': 'Perfil',
  '/app/profile/edit': 'Perfil / Editar',
};

@Component({
  selector: 'app-main-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private router = inject(Router);
  private auth = inject(AuthService);
  private tokens = inject(TokenService);
  private customerService = inject(CustomerService);

  sidebarOpen = false;

  isAdmin = this.tokens.role === 'ADMIN';

  userName = signal(this.tokens.email ?? 'Usuario');
  userInitials = signal('U');

  constructor() {
    if (this.isAdmin) {
      this.userName.set('Administrador');
      this.userInitials.set('AD');
      return;
    }
    this.customerService.findMe().subscribe({
      next: c => {
        this.userName.set(c.fullName);
        this.userInitials.set(this.initialsOf(c.fullName));
      },
      error: () => {},
    });
  }

  private initialsOf(name: string): string {
    return (
      name
        .split(' ')
        .filter(Boolean)
        .map(p => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'U'
    );
  }

  crumb = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => this.labelFor(e.urlAfterRedirects)),
      startWith(this.labelFor(this.router.url)),
    ),
    { initialValue: 'Inicio' },
  );

  private labelFor(url: string): string {
    const clean = url.split('?')[0].split('#')[0];
    return CRUMBS[clean] ?? 'Inicio';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
