import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
    id: number;
    hashedId: string;
    title: string;
    description: string;
    imageUrl: string;
    authorName: string;
    authorAvatar?: string;
    authorId: number; 
    category: 'COMIDA' | 'POSTRE' | 'EMPANADA' | 'VEGETARIANO';
    ingredients: string;
    steps: string[];
    likes: number;
    likedByCurrentUser: boolean;
    owner: boolean;
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

    getById(hashedId: string): Observable<Recipe> {
        return this.http.get<Recipe>(`${this.baseUrl}/${hashedId}`);
    }

    getByTitle(value: string): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/title?value=${value}`);
    }

    getByIngredient(value: string): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/ingredient?value=${value}`);
    }

    getByAuthor(authorHashedId: string): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/author/${authorHashedId}`);
    }

    toggleLike(hashedId: string): Observable<any> {
        return this.http.post(`${this.likesUrl}/${hashedId}`, {});
    }

    toggleUnlike(hashedId: string): Observable<any> {
        return this.http.delete(`${this.likesUrl}/${hashedId}`);
    }

    delete(hashedId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${hashedId}`);
    }

    toggleFavorite(hashedId: string): Observable<void> {
        return this.http.post<void>(`${this.favoritesUrl}/${hashedId}`, {});
    }

    toggleUnfavorite(hashedId: string): Observable<void> {
        return this.http.delete<void>(`${this.favoritesUrl}/${hashedId}`);
    }

    isFavorited(hashedId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.favoritesUrl}/exists/${hashedId}`);
    }

    crearRecetaFormData(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}`, formData);
    }

    editRecipe(hashedId: string, recipe: Partial<Recipe>): Observable<Recipe> {
        return this.http.put<Recipe>(`${this.baseUrl}/${hashedId}`, recipe);
    }

    editRecipeFormData(hashedId: string, formData: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/${hashedId}`, formData);
    }

    getFavoritosUsuario(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.favoritesUrl);
    }
}