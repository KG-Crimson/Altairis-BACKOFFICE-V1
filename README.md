# Altairis BackOffice

## Descripción

Altairis BackOffice es una pequeña aplicación de gestión como proyecto de prueba técnica. Permite crear y administrar:
- Hoteles
- Tipos de habitación (RoomTypes)
- Reservas (Bookings)
- Inventarios por fecha (disponibilidad y limpieza)

El objetivo es demostrar integración frontend + backend, persistencia con EF Core/SQLite y despliegue con Docker Compose.

---

## Tecnologías

- Backend: .NET 8 (C#), ASP.NET Core, Entity Framework Core, SQLite
- Frontend: Next.js (App Router), React 18
- Contenerización: Docker, Docker Compose

---

## Requisitos locales

- Docker Desktop + Docker Compose
- (Opcional) Node.js 20+ para desarrollo frontend
- (Opcional) .NET 8 SDK para desarrollo backend

---

## Arrancar la aplicación (recomendado: Docker Compose)

Desde la raíz del proyecto ejecuta:

```bash
docker-compose down --remove-orphans && docker-compose up --build -d
```

Esto:
- detiene contenedores anteriores (si los hay),
- reconstruye imágenes (con --build) y
- arranca `backend` y `frontend` en segundo plano.

Comprobar estado y logs:

```bash
docker-compose ps
docker-compose logs --tail=200 backend frontend
```

URLs por defecto:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5113 (endpoints: /api/Hotels, /api/RoomTypes, /api/Inventories, /api/Bookings)

---

## Desarrollo local (opcional)

Frontend (desarrollo, hot-reload):

```bash
cd frontend
npm install
npm run dev
```

Backend (desarrollo):

```bash
cd backend/Altairis.Api
dotnet run
```

Nota: si ejecutas frontend en `npm run dev`, ajusta `NEXT_PUBLIC_API_BASE` para apuntar al backend local (`http://localhost:5113`).

---

## Notas operativas

- El `docker-compose.yml` ya define los servicios `backend` y `frontend` y la variable `NEXT_PUBLIC_API_BASE` usada por el frontend.
- Para evitar registros duplicados en inventarios la API consolidará entradas con el mismo `RoomTypeId + Date`.


