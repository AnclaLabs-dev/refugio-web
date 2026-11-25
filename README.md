# Refugio · Frontend

Frontend de **Refugio**, una billetera digital multimoneda para aprender y practicar operaciones financieras en un entorno de simulación.

Proyecto desarrollado por **Ancla Labs**.

> Refugio utiliza saldos de simulación. No opera con dinero real.

## Enlaces

- [Aplicación](https://refugio-web-seven.vercel.app)
- [Repositorio frontend](https://github.com/AnclaLabs-dev/refugio-web)
- [Repositorio backend](https://github.com/AnclaLabs-dev/refugio-api)
- [Documentación de la API](https://refugio-api-production-1c49e3aa.up.railway.app/api-docs)

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| React 19 | Construcción de la interfaz |
| TypeScript 6 | Tipado del código |
| Vite 8 | Desarrollo y compilación |
| Tailwind CSS 4 | Estilos y diseño responsive |
| React Router 7 | Navegación y rutas protegidas |
| Firebase Authentication 13 | Registro, autenticación y sesión |
| ESLint 10 | Análisis estático |
| Vercel | Despliegue del frontend |

Las versiones y dependencias completas se encuentran en `package.json`. El archivo `package-lock.json` registra las versiones resueltas.

## Funcionalidades implementadas

### Autenticación

- Registro con correo electrónico, contraseña y nombre.
- Inicio y cierre de sesión mediante Firebase Authentication.
- Persistencia de sesión.
- Rutas protegidas.
- Validaciones de formularios y mensajes de error en español.
- Sincronización del usuario con el backend después del registro y del login.
- Cierre de sesión al finalizar el registro para continuar desde el login.

### Dashboard

- Balances de ARS, USD, USDT y BTC obtenidos desde la API.
- Estados de carga, error y respuesta sin balances.
- Reintento de la consulta ante errores.
- Conservación de la precisión de los importes recibidos como texto.
- Recuperación mediante sincronización si `/wallet` responde con estado `404`.

Los balances pertenecen a la cuenta guardada en el backend, pero representan dinero de simulación. Una cuenta nueva comienza con las cuatro monedas en cero.

### Cotizaciones

Panel de referencia para:

- Dólar oficial.
- Dólar MEP.
- Dólar blue.
- Dólar cripto.

Cada cotización muestra compra, venta, fuente simulada y antigüedad.

> El panel todavía utiliza mocks. Sus precios y fechas son ficticios; no consulta cotizaciones en vivo. El contador de antigüedad avanza sin actualizar los precios.

### Interfaz

- Componentes reutilizables: Button, Input y Card.
- Sidebar para escritorio.
- Barra inferior de navegación para móvil y tablet.
- Diseño responsive para Dashboard y Cotizaciones.
- Identidad visual de Refugio y Ancla Labs.
- Detalles decorativos con sombras y blur.
- Secciones pendientes identificadas con 🚧.
- Ajustes de carga de fuentes, SEO y validaciones incorporados durante el desarrollo.

## Requisitos

- Node.js compatible con Vite 8; se recomienda Node.js 22.12 o superior de la rama 22.
- npm.
- Git.
- Configuración web del proyecto Firebase utilizado por el equipo.
- Acceso al backend para consultar los balances.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/AnclaLabs-dev/refugio-web.git
cd refugio-web
```

### 2. Cambiar a la rama de desarrollo

```bash
git switch dev
git pull --ff-only origin dev
```

### 3. Instalar dependencias

```bash
npm ci
```

### 4. Configurar el entorno

Crear `.env.local` en la raíz a partir de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

En macOS o Linux:

```bash
cp .env.example .env.local
```

Completar las variables de Firebase con la configuración web proporcionada por el equipo. Los nombres deben coincidir con los utilizados en `src/services/firebase.ts`.

Configurar la URL del backend:

```env
VITE_API_URL=https://refugio-api-production-1c49e3aa.up.railway.app
```

El cliente también admite `VITE_API_BASE_URL` como alternativa. Si ambas están definidas, `VITE_API_URL` tiene prioridad.

Las variables con prefijo `VITE_` se incluyen en el código enviado al navegador: deben contener únicamente configuración pública, nunca claves privadas ni credenciales de servicio.

No subir `.env.local` al repositorio. Mantener `.env.example` actualizado y sin secretos.

Después de modificar variables de entorno, reiniciar el servidor de desarrollo.

### 5. Iniciar la aplicación

```bash
npm run dev
```

Abrir la dirección indicada por Vite, habitualmente:

```text
http://localhost:5173
```

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Comprueba TypeScript y genera el build en `dist/` |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Permite revisar el build localmente |

Para revisar el build:

```bash
npm run build
npm run preview
```

El proyecto no tiene actualmente un script de pruebas automatizadas configurado en `package.json`. ESLint y el build complementan las pruebas manuales; no las reemplazan.

## Organización del código

```text
src/
├── assets/                 Recursos visuales
├── components/
│   ├── dashboard/          Componentes del Dashboard y cotizaciones
│   ├── layout/             Layout y protección de rutas
│   └── ui/                 Componentes reutilizables
├── context/                Estado compartido de autenticación
├── mocks/                  Datos simulados de cotizaciones
├── pages/                  Pantallas de la aplicación
├── services/               Firebase, cliente HTTP y consultas a la API
├── types/                  Tipos compartidos
├── App.tsx                 Configuración de la aplicación y rutas
├── index.css               Estilos globales y variables de diseño
└── main.tsx                Punto de entrada
```

### Servicios principales

- `firebase.ts`: inicialización de Firebase.
- `api.ts`: cliente HTTP, token de autenticación y errores de la API.
- `authErrors.ts`: mensajes de errores de autenticación.
- `wallet.ts`: consulta de balances y recuperación de usuarios no sincronizados.

## Conexión con el backend

URL de la API desplegada:

```text
https://refugio-api-production-1c49e3aa.up.railway.app
```

El frontend utiliza solicitudes directas a la API. El backend debe permitir mediante CORS los orígenes utilizados por el equipo.

Orígenes informados como habilitados:

```text
http://localhost:5173
https://refugio-web-seven.vercel.app
```

Si Vite inicia en otro puerto o se utiliza una URL de Preview de Vercel, debe comprobarse que ese origen también esté permitido.

### Autenticación de solicitudes

Los endpoints protegidos reciben el ID token de Firebase:

```http
Authorization: Bearer <firebaseIdToken>
```

`apiFetch` obtiene el token del usuario autenticado y lo incorpora a las solicitudes protegidas. No se deben guardar tokens en el repositorio ni incluirlos en capturas o logs compartidos.

### Endpoints utilizados

| Método | Ruta | Uso |
| --- | --- | --- |
| `POST` | `/auth/sync` | Sincronizar el usuario y crear su wallet si corresponde |
| `GET` | `/wallet` | Consultar los balances de la cuenta |

Durante registro y login se solicita la sincronización con el backend.

El Dashboard consulta `/wallet`. Si recibe un `404`, intenta sincronizar el usuario y repite la consulta una sola vez.

### Precisión de importes

La API devuelve `amount` como texto:

```json
{
  "currency_code": "BTC",
  "decimals": 8,
  "amount": "0.00500000"
}
```

El frontend conserva ese texto y aplica formato visual sin convertirlo a `Number`.

Esto evita introducir pérdidas de precisión y mantiene los decimales proporcionados por el backend.

## Verificación manual

Antes de solicitar una revisión:

```bash
npm run lint
npm run build
```

Comprobar también:

- Registro e inicio de sesión.
- Validaciones y mensajes de error de los formularios.
- Persistencia de sesión al recargar.
- Protección del Dashboard sin sesión.
- Cierre de sesión.
- Carga de los cuatro balances desde `/wallet`.
- Visualización correcta de saldos en cero y decimales.
- Mensaje de error y recuperación con Reintentar.
- Presentación del Dashboard y Cotizaciones en móvil y escritorio.
- Ausencia de contenido tapado por la navegación inferior.
- Identificación visible de las cotizaciones como datos de ejemplo.

Para simular una falla de balances, bloquear únicamente la solicitud `/wallet` desde DevTools. Luego quitar el bloqueo y utilizar Reintentar.

Al finalizar, dejar desactivados los bloqueos y las limitaciones de red.

## Despliegue

El frontend se despliega en Vercel.

La configuración del entorno de despliegue debe incluir:

- Las variables públicas requeridas por Firebase.
- `VITE_API_URL` con la dirección del backend.

Configuración de build:

```text
Comando: npm run build
Directorio de salida: dist
```

Las variables de Vite se incorporan durante la compilación. Si se modifican en Vercel, debe generarse un nuevo despliegue.

El backend también debe permitir el dominio del frontend mediante CORS. La configuración del proyecto Firebase debe admitir los dominios necesarios para los flujos de autenticación utilizados.

## Flujo de trabajo

- `main`: rama estable.
- `dev`: integración del equipo.
- `feat/...`: desarrollo de funcionalidades.
- `fix/...`: correcciones.

Crear las ramas desde un `dev` actualizado y abrir las pull requests hacia `dev`.

Los commits se escriben en español. Ejemplo:

```bash
git commit -m "feat: integrar balances del dashboard con la API"
```

Antes del merge:

1. Ejecutar lint y build.
2. Probar el flujo afectado.
3. Solicitar revisión a otro integrante del equipo.
4. Resolver los comentarios y conflictos.
5. Integrar la PR y eliminar la rama cuando deje de utilizarse.

## Pendientes

- Reemplazar los mocks de cotizaciones por el endpoint correspondiente.
- Completar las pruebas cruzadas entre integrantes.
- Continuar los flujos de operación y las secciones previstas para las siguientes etapas.
- Revisar rendimiento, accesibilidad y SEO sobre los despliegues actualizados.

El estado de cada funcionalidad debe mantenerse alineado con el tablero del equipo y las pull requests integradas.