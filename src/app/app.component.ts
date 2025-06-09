import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent]
})
export class AppComponent implements OnInit {
  title = 'SnapEat';
  showHeaderFooter: boolean = true;
  showBreadcrumb = true;

  hiddenRoutes = ['/login', '/registro', '/guestArea', '/receta/'];

  @HostBinding('class.sin-header') get sinHeader() {
    return !this.showHeaderFooter;
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects.split('?')[0];
        this.showHeaderFooter = !this.hiddenRoutes.some(route => currentUrl.startsWith(route));
        this.showBreadcrumb = !['/', '/login', '/registro'].includes(currentUrl);
      });
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}