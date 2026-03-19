# Sofía – Lista de Deseos

Lista de deseos de cumpleaños con aportes, subida de comprobantes y panel de administración. Construida con Next.js 14 y Firebase.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, React Hook Form, Zod
- **Backend:** Firebase (Firestore, Storage, Authentication solo para admin)

## Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase

## Setup

### 1. Clonar e instalar

```bash
git clone <repo>
cd presents
npm install
```

### 2. Variables de entorno

Copia el ejemplo y rellena con tu configuración de Firebase:

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

- `NEXT_PUBLIC_FIREBASE_*`: valores de tu proyecto en [Firebase Console](https://console.firebase.google.com) → Configuración del proyecto → Tus apps.
- `NEXT_PUBLIC_ADMIN_EMAIL`: email del usuario que podrá acceder a `/admin` (debe existir en Firebase Authentication con Email/Password).

### 3. Firebase

1. Crea un proyecto en Firebase.
2. Activa **Authentication** → método **Correo/Contraseña**.
3. Crea un usuario con el mismo email que `NEXT_PUBLIC_ADMIN_EMAIL` (para el panel admin).
4. Activa **Firestore** y **Storage**.
5. En Firestore, crea las colecciones (opcional; se crean al escribir):
   - `wishlist_gifts`
   - `wishlist_contributions`
   - `wishlist_purchases`
6. En Firestore → Índices: crea índices compuestos:
   - Colección: `wishlist_contributions`
     - Campos: `createdAt` (Descendente)
   - Colección: `wishlist_purchases`
     - Campos: `createdAt` (Descendente)

### 4. Reglas de seguridad

#### Firestore (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Email del admin (reemplaza por el que uses en NEXT_PUBLIC_ADMIN_EMAIL)
    function isAdmin() {
      return request.auth != null &&
        request.auth.token.email == "admin@example.com";
    }

    // wishlist_gifts: lectura pública; escritura solo admin
    match /wishlist_gifts/{giftId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // wishlist_contributions: creación pública; lectura de aprobados para progreso; update/delete solo admin
    match /wishlist_contributions/{contributionId} {
      allow create: if true;
      allow read: if resource.data.status == "approved" || isAdmin();
      allow update, delete: if isAdmin();
    }

    // wishlist_purchases: creación y lectura públicas; delete solo admin; update no permitido
    match /wishlist_purchases/{purchaseId} {
      allow create, read: if true;
      allow update: if false;
      allow delete: if isAdmin();
    }
  }
}
```

Así el público solo puede leer aportes aprobados (para la barra de progreso) y el admin puede leer todos. Ajusta `"admin@example.com"` al valor de `NEXT_PUBLIC_ADMIN_EMAIL`.

#### Storage (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null &&
        request.auth.token.email == "admin@example.com";
    }

    // Comprobantes de pago: cualquiera puede subir; solo admin puede borrar
    match /wishlist_proofs/{allPaths=**} {
      allow read: if true;
      allow write: if true;
      allow delete: if isAdmin();
    }

    // Imágenes de regalos: solo admin
    match /wishlist_gifts/{allPaths=**} {
      allow read: if true;
      allow write, delete: if isAdmin();
    }
  }
}
```

Sube estas reglas desde la consola de Firebase (Firestore → Reglas / Storage → Reglas).

### 5. Ejecutar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El panel admin está en [http://localhost:3000/admin](http://localhost:3000/admin).

## Deploy en Vercel

1. Sube el repo a GitHub.
2. En [Vercel](https://vercel.com), importa el proyecto desde GitHub.
3. Añade las mismas variables de entorno que en `.env.local` (con el prefijo `NEXT_PUBLIC_` donde corresponda).
4. Deploy. Vercel usará el script `build` por defecto.

## Estructura del proyecto

- `app/` – Rutas (landing, admin, admin/login).
- `components/` – Hero, sección explicativa, lista de regalos, modal de aporte, barra de progreso.
- `components/admin/` – Formulario de regalos, tabla de aportes.
- `hooks/` – useGifts, useContributions, useApprovedContributions, useAuth.
- `lib/` – Firebase, tipos, esquema Zod del formulario de aporte.

## Licencia

Privado / uso personal.
