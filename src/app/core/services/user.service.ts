import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) { }

    actualizarPerfil(formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, formData);
    }

    getPerfil(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`);
    }

    cambiarContraseña(dto: { oldPassword: string; newPassword: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/change-password`, dto);
    }

    getUserAvatars(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/me/avatars`);
    }

    eliminarAvatar(url: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/me/avatars`, {
            params: { imageUrl: url }
        });
    }

    setAvatarSeleccionado(imageUrl: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, {
            name: '',
            imageUrl: imageUrl
        });
    }
}