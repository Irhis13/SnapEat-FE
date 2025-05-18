import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMobileMenuOpen = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkAuthStatus();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isMobileMenuOpen = false;
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.closeMenu();
    this.router.navigate(['/']);
  }

  private checkAuthStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }
}