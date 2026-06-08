# PagoYa Web

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-757575?style=for-the-badge&logo=angular&logoColor=white)
![Signals](https://img.shields.io/badge/Angular_Signals-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

Aplicación web de banca digital que permite gestionar cuentas, realizar transferencias y consultar reportes financieros.

**Autor:** Henry Antonio Mendoza Puerta

---

## Funcionalidad

- **Autenticación:** registro e inicio de sesión de usuarios con tokens.
- **Cuentas:** crear, listar y depositar en cuentas bancarias.
- **Transferencias:** enviar dinero entre cuentas y ver el historial.
- **Dashboard:** resumen visual de la actividad financiera con gráficos.
- **Reportes:** reportes de cuentas y transferencias.
- **Perfil:** ver y editar los datos del usuario.
- **Roles:** rutas protegidas según el tipo de usuario (admin / cliente).

---

## Tecnologías utilizadas

- **Angular 21** (standalone components)
- **Angular Signals** (manejo de estado reactivo)
- **Angular Material** + Angular CDK (componentes de UI)
- **TypeScript**
- **Netlify** (despliegue del frontend)
- **Render** (backend / API)

---

## Comandos

| Acción | Comando |
|---|---|
| Instalar dependencias | `npm install` |
| Servidor de desarrollo | `npm start` (o `ng serve`) → http://localhost:4200 |
| Compilar para producción | `npm run build` |

---

## Despliegue

El frontend se despliega automáticamente en **Netlify** con cada `git push` a la rama `main`.
La conexión con el backend (API) se configura en `netlify.toml` mediante un proxy de `/api` hacia el servidor en Render.
