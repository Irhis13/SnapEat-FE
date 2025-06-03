import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
    label: string;
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
    breadcrumbs$ = this.breadcrumbsSubject.asObservable();

    private currentBreadcrumbs: Breadcrumb[] = [];

    setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
        this.currentBreadcrumbs = breadcrumbs;
        this.breadcrumbsSubject.next(breadcrumbs);
    }

    reemit() {
        this.breadcrumbsSubject.next(this.currentBreadcrumbs);
    }
}