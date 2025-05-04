import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    authorName: string;
    tipo: string;
    likes?: number;
}

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private apiUrl = 'http://localhost:8080/api/recipes';

    constructor(private http: HttpClient) { }

    getLatestRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.apiUrl}/latest`);
    }

    getTopLikedRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.apiUrl}/top-liked`);
    }

    getAll(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.apiUrl}`);
    }

    getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.apiUrl}`);
    }
}
