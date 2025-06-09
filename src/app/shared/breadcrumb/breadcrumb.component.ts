import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from 'app/core/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbsFiltered: Breadcrumb[] = [];
  showBreadcrumb = true;

  private readonly hiddenRoutes = ['/', '/login', '/registro'];

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
      this.breadcrumbsFiltered = breadcrumbs.filter(b => b.label?.trim() !== '');
      this.showBreadcrumb = !this.hiddenRoutes.includes(this.router.url);
    });

    setTimeout(() => this.breadcrumbService.reemit(), 0);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }
}
