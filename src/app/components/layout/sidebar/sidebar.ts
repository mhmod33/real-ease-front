import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { AppModal } from '../../shared/app-modal/app-modal';
import { AuthService } from '../../../services/auth-service';

interface NavItem {
  label: string;
  route: string;
  icon: 'dashboard' | 'properties' | 'orders' | 'agents' | 'users';
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, AppModal],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);
  readonly collapsed = signal(false);
  private authService=inject(AuthService)
  showLogoutModal = false;

  readonly navItems: NavItem[] = [
    { label: 'لوحة التحكم', route: '/dashboard', icon: 'dashboard' },
    { label: 'العقارات', route: '/properties', icon: 'properties' },
    { label: 'الطلبات', route: '/orders', icon: 'orders' },
    { label: 'الوكلاء', route: '/agents', icon: 'agents' },
    { label: 'المستخدمين', route: '/users', icon: 'users' },
  ];

  toggleCollapse(): void {
    this.collapsed.update((value) => !value);
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.sidebarService.close();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
