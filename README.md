# Prueba Técnica - Aplicación de Productos con Angular y DummyJSON

Esta es una aplicación web SPA (Single Page Application) desarrollada en Angular como parte de una prueba técnica. La aplicación implementa un sistema de autenticación de usuarios y un panel de control (dashboard) para la gestión completa (CRUD) de productos, consumiendo la API de simulación **DummyJSON**.

## ✨ Características Principales

* **Login de Usuario:** Formulario reactivo con validaciones en tiempo real.
* **Autenticación con JWT:** Flujo de autenticación completo usando tokens (`accessToken` y `refreshToken`).
* **Interceptor HTTP (`AuthInterceptor`):** Añade automáticamente el token de autorización a las peticiones protegidas y maneja la lógica de refresco del token en caso de expiración (error 401).
* **Rutas Protegidas (`AuthGuard`):** El dashboard es una ruta privada a la que solo se puede acceder después de iniciar sesión.
* **Dashboard de Productos:** Panel de control para visualizar, crear, editar y eliminar productos.
* **CRUD Completo:**
    * **Crear:** Abre un modal para añadir un nuevo producto.
    * **Leer:** Muestra los productos en una tabla paginada de PrimeNG.
    * **Actualizar:** Permite editar un producto existente en el mismo modal.
    * **Eliminar:** Pide confirmación antes de eliminar un producto.
* **Arquitectura Moderna:**
    * Uso exclusivo de **Standalone Components**.
    * Carga perezosa (`Lazy Loading`) para el módulo del Dashboard.
    * Estrategia de detección de cambios `OnPush` y uso del pipe `async` para un rendimiento óptimo.
* **Pruebas Unitarias:** Cobertura de pruebas para los servicios y componentes más críticos de la aplicación usando Jasmine y Karma.

## 🛠️ Tecnologías Utilizadas

* **Angular 19+**
* **TypeScript**
* **RxJS** para el manejo de la asincronía.
* **PrimeNG** como librería de componentes UI (Tabla, Modal, Botones, etc.).
* **PrimeFlex** para el layout y sistema de rejilla (grid).
* **Jasmine y Karma** para las pruebas unitarias.

## 🚀 Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada).
* [Angular CLI](https://angular.io/cli) (versión 19.x o superior recomendada).

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  **Navegar a la carpeta del proyecto:**
    ```bash
    cd nombre-del-proyecto
    ```

3.  **Instalar dependencias:**
    ```bash
    npm install
    ```

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    ng serve -o
    ```
    La aplicación se compilará y se abrirá automáticamente en tu navegador en la dirección `http://localhost:4200/`.

## ✅ Ejecutar Pruebas

Para ejecutar las pruebas unitarias y ver el reporte de cobertura, utiliza el siguiente comando:
```bash
ng test
```

## 🔑 Credenciales de Prueba

Para iniciar sesión en la aplicación, puedes utilizar el siguiente usuario proporcionado por DummyJSON:

* **Usuario:** `emilys`
* **Contraseña:** `emilyspass`