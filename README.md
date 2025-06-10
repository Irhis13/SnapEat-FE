# SnapEat Frontend

Este es el frontend del proyecto **SnapEat**, una aplicación Angular diseñada para explorar, crear y guardar recetas gastronómicas. Conecta con la API REST desarrollada en Spring Boot para ofrecer una experiencia completa e interactiva.

---

## Funcionalidades principales

- Autenticación de usuarios (registro, login, logout)
- Visualización de recetas con imágenes, pasos e ingredientes
- CRUD completo de recetas
- Gestión de favoritos y likes
- Edición de perfil de usuario (datos, avatar, contraseña)
- Navegación intuitiva, responsive y validaciones en formularios

---

## Estructura del proyecto

```plaintext
src/
├── app/
│   ├── auth/                  # Login y registro de usuarios
│   ├── core/                  # Servicios, interceptores, guards
│   ├── pages/                 # Vistas principales: home, recetas, perfil, favoritos
│   ├── shared/                # Componentes reutilizables (header, footer, cards, etc.)
│   ├── app.routes.ts          # Configuración de rutas
│   └── app.component.ts       # Componente raíz
├── assets/                    # Imágenes, avatares, recursos estáticos
├── index.html                 # Archivo HTML principal
├── main.ts                    # Bootstrap de Angular
└── styles.scss                # Estilos globales

```
---

## Requisitos previos

- Node.js 18+
- Angular CLI 19+

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Irhis13/SnapEat-FE.git
```

### 2. Instalar dependencias
```bash
npm install
```
> **Importante**: Si no tienes Angular CLI instalado globalmente, hazlo con:
```bash
npm install -g @angular/cli
```

### 3. Levantar servidor de desarrollo
```bash
ng serve
```
> **Importante**: Asegurarse que el backend esté corriendo en la URL especificada en los service. Si usas otra URL o puerto, modifica las rutas en los servicios:
> - auth.service.ts
> - receta.service.ts
> - user.service.ts

---

## Contribuciones

Toda mejora, sugerencia o reporte de errores es bienvenida. ¡Gracias por ayudar a mejorar SnapEat!
