import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';
  showSidebar = true;
  activeLink: string = '';
  hideMenuIcon: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      this.showSidebar = !['/login', '/register'].includes(url);
      this.hideMenuIcon = ['/login', '/register'].includes(url);
      this.setActiveLink(url.split('/')[1]);
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
  }
}
