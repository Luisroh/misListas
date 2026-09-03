# 🛒 Lista de la Compra - Full Stack

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

Aplicación web completa para gestionar listas de la compra con **autenticación de usuarios**, **listas compartidas** y una interfaz moderna con temática lila/morado.

---

## 📋 Tabla de Contenidos

- [Demo](#-demo)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Próximas Mejoras](#-próximas-mejoras)
- [Autor](#-autor)
- [Licencia](#-licencia)

---

## 🎯 Demo

> **🔗 Enlace:** [Próximamente - Desplegaré en Render/Vercel]  
> **Usuario de prueba:** `admin`  
> **Contraseña:** `123456`

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Registro e inicio de sesión de usuarios con **JWT**.
- Protección de rutas privadas en el frontend y backend.
- Tokens de acceso y refresco para sesiones seguras.
- Variables de entorno para proteger secretos.

### 📋 Gestión de Listas
- Creación de listas de compra personalizadas.
- Visualización de todas las listas del usuario en un desplegable.
- Compartir listas con otros usuarios (solo el propietario puede compartir).
- Visualización de usuarios con los que se comparte cada lista.

### 🛒 Gestión de Productos
- Añadir, modificar y eliminar productos dentro de cada lista.
- Marcar productos como "comprados" con un checkbox.
- Validación para evitar productos duplicados en una misma lista.
- Transformación automática a mayúsculas al escribir.

### 🎨 Diseño y Experiencia de Usuario
- Interfaz moderna con temática **lila/morado** (mi color favorito 💜).
- **Modales personalizados** para confirmar acciones (sin usar `confirm()` del navegador).
- **Notificaciones Toast** para feedback visual de las acciones (éxito, error, advertencia).
- Responsive para dispositivos móviles.
- Animaciones suaves en hover y transiciones.
- Selector de listas estilizado con flecha personalizada.
- Sección de compartir con tags visuales para los usuarios.

---

## 🧰 Tecnologías Utilizadas

### Backend
| Tecnología | Descripción |
|---|---|
| **Django 5** | Framework web de alto nivel. |
| **Django REST Framework** | Construcción de API REST. |
| **SimpleJWT** | Autenticación basada en JSON Web Tokens. |
| **python-decouple** | Gestión de variables de entorno. |
| **SQLite** | Base de datos ligera (fácil migración a PostgreSQL). |
| **CORS Headers** | Comunicación segura entre frontend y backend. |

### Frontend
| Tecnología | Descripción |
|---|---|
| **React 18** | Biblioteca para interfaces de usuario. |
| **Vite** | Bundler y servidor de desarrollo rápido. |
| **Axios** | Cliente HTTP para consumir la API. |
| **jwt-decode** | Decodificación de tokens JWT en el cliente. |

### Estilos
- **CSS3** con diseño 100% personalizado.
- Paleta de colores: lila/morado (`#4A148C`, `#6A1B9A`, `#9C27B0`, `#CE93D8`, etc.).
- Gradientes, sombras y animaciones para una experiencia pulida.

---

## 📁 Estructura del Proyecto

```
Proyecto Portafolio/
|
+-- lista_compras_django/          # Backend
|   |
|   +-- .env                       # Variables de entorno
|   +-- .env.example               # Ejemplo de variables
|   +-- .gitignore                 # Archivos excluidos
|   +-- manage.py
|   |
|   +-- compras/                   # App principal
|   |   +-- models.py              # ListaCompra, Compra
|   |   +-- serializers.py         # Serializers de DRF
|   |   +-- views.py               # Viewsets y RegisterView
|   |   +-- urls.py                # Rutas de la API
|   |   +-- admin.py               # Registro en Django Admin
|   |
|   +-- lista_compras/             # Configuracion del proyecto
|       +-- settings.py            # Configuracion con variables de entorno
|
+-- listacompra-frontend/          # Frontend
|   |
|   +-- .env                       # Variables de entorno
|   +-- .env.example               # Ejemplo de variables
|   +-- .gitignore                 # Archivos excluidos
|   +-- package.json
|   |
|   +-- src/
|       +-- components/
|       |   +-- Login.jsx          # Pagina de login/registro
|       |   +-- Login.css          # Estilos de login
|       |   +-- ModalConfirmar.jsx # Modal para eliminar
|       |   +-- ModalConfirmar.css # Estilos del modal
|       |   +-- ToastNotificacion.jsx # Notificaciones
|       |   +-- ToastNotificacion.css # Estilos del toast
|       |
|       +-- context/
|       |   +-- AuthContext.jsx    # Autenticacion global
|       |
|       +-- App.jsx                # Componente principal
|       +-- App.css                # Estilos globales con tema lila
|
+-- README.md                      # Este archivo
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Python 3.11+
- Node.js 18+
- npm o yarn
- Git (opcional, para clonar)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/lista-compra-fullstack.git
cd lista-compra-fullstack
```

---

### 2. Configurar el Backend (Django)

```bash
# Entrar a la carpeta del backend
cd lista_compras_django

# Crear y activar entorno virtual
python -m venv .venv
# En Windows:
.venv\Scripts\activate
# En Mac/Linux:
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores (SECRET_KEY, DEBUG, etc.)

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Arrancar el servidor
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000/`

---

### 3. Configurar el Frontend (React)

```bash
# Abrir una nueva terminal y entrar a la carpeta del frontend
cd listacompra-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con la URL de tu API (VITE_API_URL)

# Arrancar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173/`

---

### 4. Variables de Entorno

#### Backend (`.env`)
```env
SECRET_KEY=django-insecure-tu-clave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=db.sqlite3
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000/api/
VITE_API_TOKEN_URL=http://localhost:8000/api/token/
VITE_API_REFRESH_URL=http://localhost:8000/api/token/refresh/
```

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| **POST** | `/api/register/` | Registrar un nuevo usuario | ❌ |
| **POST** | `/api/token/` | Iniciar sesión (obtener token) | ❌ |
| **POST** | `/api/token/refresh/` | Refrescar token | ❌ |
| **GET** | `/api/listas/` | Listar todas las listas del usuario | ✅ |
| **POST** | `/api/listas/` | Crear una nueva lista | ✅ |
| **GET** | `/api/listas/{id}/` | Obtener detalles de una lista | ✅ |
| **PUT/PATCH** | `/api/listas/{id}/` | Actualizar una lista | ✅ |
| **DELETE** | `/api/listas/{id}/` | Eliminar una lista | ✅ |
| **POST** | `/api/listas/{id}/compartir/` | Compartir lista con otro usuario | ✅ |
| **GET** | `/api/compras/` | Listar productos de las listas | ✅ |
| **POST** | `/api/compras/` | Añadir producto a una lista | ✅ |
| **GET** | `/api/compras/{id}/` | Obtener detalles de un producto | ✅ |
| **PUT/PATCH** | `/api/compras/{id}/` | Actualizar un producto | ✅ |
| **DELETE** | `/api/compras/{id}/` | Eliminar un producto | ✅ |

---

## 🖼️ Capturas de Pantalla

### Pantalla de Login / Registro
![Login](https://via.placeholder.com/800x400?text=Login+Screen)

### Selector de Listas y Creación
![Selectores](https://via.placeholder.com/800x400?text=Selectores+de+Listas)

### Lista de Productos
![Lista de Productos](https://via.placeholder.com/800x400?text=Lista+de+Productos)

### Modal de Confirmación
![Modal Confirmar](https://via.placeholder.com/800x400?text=Modal+de+Confirmacion)

### Notificaciones Toast
![Toast](https://via.placeholder.com/800x400?text=Notificaciones+Toast)

### Compartir Lista
![Compartir](https://via.placeholder.com/800x400?text=Compartir+Lista)

---

## 🛠️ Próximas Mejoras

- [ ] Despliegue en Render (Backend) y Vercel (Frontend)
- [ ] Tests unitarios y de integración
- [ ] Paginación en la API
- [ ] Búsqueda y filtrado de productos
- [ ] Categorías para organizar productos
- [ ] Notificaciones por email al compartir listas
- [ ] Modo oscuro
- [ ] Subir imágenes para productos

---

## 👨‍💻 Autor

**Luis**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/tuusuario)  
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tuusuario)  
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=portfolio&logoColor=white)](https://tusitio.com)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## 🙏 Agradecimientos

- A mi profesor de FOAP por introducirme al mundo de la programación.
- A la comunidad de Django y React por su increíble documentación.
- A la IA que me acompañó en el proceso de desarrollo y debugging.

---

**💜 Hecho con pasión y mucho código morado.**
