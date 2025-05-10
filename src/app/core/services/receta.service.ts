import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    authorName: string;
    category: 'COMIDA' | 'POSTRE' | 'EMPANADA' | 'VEGETARIANO';
    ingredients: string;
    steps: string[];
    likes: number;
    likedByCurrentUser: boolean;
    isOwner: boolean;
    favoritedByCurrentUser: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private baseUrl = 'http://localhost:8080/api/recipes';
    private likesUrl = 'http://localhost:8080/api/likes';
    private favoritesUrl = 'http://localhost:8080/api/favorites';

    constructor(private http: HttpClient) { }

    getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.baseUrl);
    }

    getLatestRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/latest`);
    }

    getTopLikedRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/top-liked`);
    }

    getById(id: number): Observable<Recipe> {
        return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
    }

    getByTitle(value: string): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/title?value=${value}`);
    }

    getByIngredient(value: string): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/ingredient?value=${value}`);
    }

    getByAuthor(authorId: number): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/author/${authorId}`);
    }

    toggleLike(recipeId: number): Observable<any> {
        return this.http.post(`${this.likesUrl}/${recipeId}`, {});
    }

    toggleUnlike(recipeId: number): Observable<any> {
        return this.http.delete(`${this.likesUrl}/${recipeId}`);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    toggleFavorite(recipeId: number): Observable<void> {
        return this.http.post<void>(`${this.favoritesUrl}/${recipeId}`, {});
    }

    toggleUnfavorite(recipeId: number): Observable<void> {
        return this.http.delete<void>(`${this.favoritesUrl}/${recipeId}`);
    }

    isFavorited(recipeId: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.favoritesUrl}/exists/${recipeId}`);
    }

    crearRecetaFormData(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}`, formData);
    }
}