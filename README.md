# Turnos y Reservas — Pre-entrega 3 (API de servicios y reservas con FileSystem)

API REST construida con **Node.js**, **Express** y **FileSystem** (módulo `fs/promises`)
que gestiona dos recursos —`services` y `bookings`— con persistencia en archivos JSON.
Toda la lógica de negocio vive en los managers (`ServiceManager` y `BookingManager`).

## Requisitos

- Node.js 18 o superior (usa módulos ESM nativos).

## Instalación

```bash
npm install
```

## Variables de entorno

Creá un archivo `.env` en la raíz del proyecto, tomando como base `.env.example`:

| Variable   | Descripción          | Ejemplo       |
| ---------- | -------------------- | ------------- |
| `PORT`     | Puerto del servidor  | `8080`        |
| `NODE_ENV` | Entorno de ejecución | `development` |

```
PORT=8080
NODE_ENV=development
```

Si falta alguna de estas variables, la aplicación **falla al iniciar** con un mensaje
claro (validación en `src/config/env.config.js`).

## Ejecución

```bash
npm start
```

o en modo desarrollo (reinicio automático):

```bash
npm run dev
```

Por defecto el servidor queda disponible en `http://localhost:8080`.

## Estructura del proyecto

```
src/
  app.js                      # Configura la app Express y monta los routers
  server.js                   # Punto de entrada: levanta el servidor
  config/env.config.js        # Carga y valida las variables de entorno
  managers/
    ServiceManager.js         # Lógica de negocio de los servicios
    BookingManager.js         # Lógica de negocio de las reservas
  routes/
    services.router.js        # Endpoints de services
    bookings.router.js        # Endpoints de bookings
  data/
    services.json             # Persistencia de servicios
    bookings.json             # Persistencia de reservas
package.json
.env.example
.gitignore
README.md
```

## Recurso `services`

```json
{
  "id": 1,
  "name": "Consulta general",
  "description": "Consulta médica general de 30 minutos",
  "duration": 30,
  "price": 5000,
  "category": "salud",
  "available": true
}
```

| Método   | Ruta                 | Descripción                                            | Códigos   |
| -------- | -------------------- | ------------------------------------------------------ | --------- |
| `GET`    | `/api/services`      | Lista todos los servicios (acepta `?category=` y `?available=`) | 200       |
| `GET`    | `/api/services/:sid` | Obtiene un servicio por id                             | 200 / 404 |
| `POST`   | `/api/services`      | Crea un servicio (id generado automáticamente)         | 201 / 400 |
| `PUT`    | `/api/services/:sid` | Actualiza un servicio (no permite cambiar el id)       | 200 / 404 |
| `DELETE` | `/api/services/:sid` | Elimina un servicio                                    | 200 / 404 |

`ServiceManager`: `getServices`, `getServiceById`, `addService`, `updateService`,
`deleteService`.

## Recurso `bookings`

```json
{
  "id": 1,
  "clientName": "Ana Pérez",
  "clientEmail": "ana@example.com",
  "date": "2026-05-20",
  "time": "15:30",
  "status": "pending",
  "services": [
    { "service": 1, "quantity": 2 },
    { "service": 3, "quantity": 1 }
  ]
}
```

Cada elemento de `services` referencia un servicio por su `id` y lleva una `quantity`.
Al agregar dos veces el mismo servicio a una reserva, se **incrementa `quantity`** en
lugar de duplicar el elemento.

| Método | Ruta                              | Descripción                                             | Códigos   |
| ------ | --------------------------------- | ------------------------------------------------------- | --------- |
| `POST` | `/api/bookings`                   | Crea una reserva (puede iniciarse con `services: []`)   | 201 / 400 |
| `GET`  | `/api/bookings/:bid`              | Obtiene una reserva por id                              | 200 / 404 |
| `POST` | `/api/bookings/:bid/services/:sid`| Agrega un servicio a una reserva (valida que ambos existan) | 200 / 404 |

`BookingManager`: `createBooking`, `getBookingById`, `addServiceToBooking`.

## Ejemplos

Crear un servicio:

```bash
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sesión de kinesiología",
    "description": "Sesión de kinesiología de 40 minutos",
    "duration": 40,
    "price": 7000,
    "category": "salud",
    "available": true
  }'
```

Crear una reserva vacía:

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Ana Pérez",
    "clientEmail": "ana@example.com",
    "date": "2026-05-20",
    "time": "15:30",
    "status": "pending"
  }'
```

Agregar un servicio a una reserva (repetir la llamada incrementa `quantity`):

```bash
curl -X POST http://localhost:8080/api/bookings/1/services/1
```

Obtener una reserva:

```bash
curl http://localhost:8080/api/bookings/1
```
