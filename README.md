# Challenge Node

API REST para gestionar usuarios, tarjetas y pagos. El backend principal esta hecho con Node.js, TypeScript, Express y Prisma para la orm sobre PostgreSQL; ademas incluye un microservicio en FastAPI muy pequeño, que simula la aprobacion o rechazo de pagos.

## Tecnologias

- Node.js + TypeScript + Express
- Prisma ORM
- PostgreSQL
- JWT para autenticacion
- Zod para validacion de datos
- Helmet, CORS y rate limiting
- FastAPI para el procesador de pagos simulado

## Instalacion

Desde la raiz del proyecto:

```bash
npm install
```

o:

```bash
pnpm install
```

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/back_node"
PORT=3000
JWT_SECRET="cambia_este_secreto(opcional)"
JWT_EXPIRES_IN=2h
API_PAGO_URL="http://localhost:8000/process"
API_KEY="clave_opcional"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
```

Notas:

- `DATABASE_URL` es obligatoria para Prisma, solamente crearla en local luego se migra.
- `JWT_SECRET` opcional.
- `API_PAGO_URL` apunta al servicio FastAPI de pagos.
- `API_KEY` es opcional. Si se define, todas las peticiones deben incluir `x-api-key`.
- `CORS_ORIGIN` es opcional. Si no se define, la API acepta cualquier origen.

## Base de datos

Primero crea la base de datos en PostgreSQL. Luego ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Si usas pnpm:

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

## Levantar el procesador de pagos

El endpoint de pagos llama a un servicio externo ubicado en `payment_service`.

```bash
cd payment_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
fastapi dev
```

El servicio expone:

```http
POST http://localhost:8000/process
```

Body:

```json
{
  "monto": 50
}
```

Respuesta posible:

```json
{
  "aprobado": true,
  "mensaje": "Pago aprobado"
}
```

## Levantar la API Node

En otra terminal, desde la raiz del proyecto:

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000
```

Endpoint de salud:

```http
GET /
```

Respuesta:

```json
{
  "message": "Api funcionando"
}
```

## Headers

Si `API_KEY` esta configurada:

```http
x-api-key: clave_opcional
```

Para rutas protegidas:

```http
Authorization: Bearer <token>
```

## Endpoints

### Crear usuario

```http
POST /api/usuarios
```

Body:

```json
{
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "password": "secreto123"
}
```

Respuesta:

```json
{
  "id": 1,
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "creado_in": "2026-05-16T00:00:00.000Z"
}
```

### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "juan@example.com",
  "password": "secreto123"
}
```

Respuesta:

```json
{
  "token": "<jwt>",
  "expires_in": "2h"
}
```

### Registrar tarjeta

Ruta protegida con JWT.

```http
POST /api/tarjetas
```

Body:

```json
{
  "usuario_fk": 1,
  "numero": "1234-5678-1234-5678",
  "nombre": "Juan Perez",
  "f_fin": "12/28"
}
```

Reglas principales:

- `usuario_fk` debe coincidir con el usuario autenticado en el token.
- `numero` debe tener formato `0000-0000-0000-0000`.
- `f_fin` debe tener formato `MM/YY`.

### Crear pago

Ruta protegida con JWT.

```http
POST /api/pagos
```

Body:

```json
{
  "usuario_fk": 1,
  "tarjeta_fk": 1,
  "monto": 50,
  "descripcion": "Pago de servicio"
}
```

Antes de registrar el pago, la API llama al procesador externo configurado en `API_PAGO_URL`. Si el procesador responde con `aprobado: false`, la API devuelve estado `402`.

### Historial de pagos

Ruta protegida con JWT.

```http
GET /api/pagos/usuario/1
```

El `usuarioId` de la URL debe coincidir con el usuario autenticado en el token.

## Estructura principal

```text
Challenge_Node/
  prisma/
    schema.prisma
    migrations/
  src/
    api/
    controllers/
    database/
    middlewares/
    routes/
    index.ts
    validators.ts
  payment_service/
    main.py
    shemas.py
    requirements.txt
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm start
npm run prisma:migrate
npm run prisma:generate
```

## Consideraciones

- Las contrasenas se guardan hasheadas con bcrypt.
- Las rutas de tarjetas y pagos requieren JWT.
- El registro de tarjetas devuelve el numero enmascarado en la respuesta.
- El servicio de pagos aprueba aleatoriamente cerca del 80% de las solicitudes.
