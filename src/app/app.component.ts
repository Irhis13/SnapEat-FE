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

  hiddenRoutes = ['/login', '/register', '/guestArea'];

  @HostBinding('class.sin-header') get sinHeader() {
    return !this.showHeaderFooter;
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const urlWithoutParams = event.urlAfterRedirects.split('?')[0];
        this.showHeaderFooter = !this.hiddenRoutes.includes(urlWithoutParams);
      });
  }
}