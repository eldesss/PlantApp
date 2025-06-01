# PlantApp 🌱

Una aplicación web moderna para identificar plantas, gestionar tu jardín digital y conectar con otros amantes de la botánica.

---

## Tecnologías principales

- **Next.js 14** (App Router)
- **Prisma ORM** + **MySQL**
- **PlantNet API** (identificación de plantas por imagen)
- **Tailwind CSS**
- **Sharp** (redimensionado de imágenes en backend)
- **Autenticación y gestión de usuarios**
- **Gestión de favoritos entre usuarios**

---

## Estructura del Proyecto

```
app/
├── api/                # Endpoints API (Next.js Route Handlers)
│   └── plantnet/       # Identificación de plantas (POST con resize)
│   └── users/          # Gestión de usuarios y favoritos
├── components/         # Componentes reutilizables (UI, botones, modales)
│   └── FavoriteButton.js
│   └── PlantModal.js
│   └── SearchBar.js
├── users/              # Páginas de usuarios y detalles
├── plants/             # Páginas de plantas
├── identify/           # Página de identificación de plantas
├── lib/                # Configuración de Prisma y utilidades
├── context/            # Contextos globales (si aplica)
├── globals.css         # Estilos globales
├── layout.js           # Layout principal
├── page.js             # Landing page
```

---

## Configuración y Primeros Pasos

1. **Clona el repositorio**
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno:**
   - Crea un archivo `.env.local` en la raíz con:
     ```
     DATABASE_URL=mysql://usuario:contraseña@localhost:3306/plantapp
     NEXT_PUBLIC_PLANTNET_API_KEY=tu_api_key_de_plantnet
     ```
4. **Configura la base de datos:**
   - Lanza las migraciones de Prisma:
     ```bash
     npx prisma migrate deploy
     ```
   - (Opcional) Para desarrollo:
     ```bash
     npx prisma studio
     ```
5. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## Características principales

- **Identificación de plantas:**  
  Sube una o varias imágenes, el backend las redimensiona a 800px y las envía a PlantNet para identificar la especie.
- **Gestión de usuarios y favoritos:**  
  Puedes marcar a otros usuarios como favoritos. El sistema es robusto y evita duplicados.
- **Gestión de plantas:**  
  Añade, visualiza y elimina plantas de tu jardín digital.
- **UI moderna y responsiva:**  
  Interfaz intuitiva, con feedback visual y componentes reutilizables.
- **Optimización de imágenes:**  
  El backend usa `sharp` para reducir el tamaño de las imágenes antes de enviarlas a PlantNet, ahorrando ancho de banda y acelerando la identificación.

---

## Modelo de Base de Datos (Prisma)

```prisma
model User {
  id           String      @id @default(cuid())
  email        String      @unique
  username     String      @unique
  password     String
  plants       Plant[]
  favorites    Favorite[]  @relation("UserFavorites")
  favoritedBy  Favorite[]  @relation("UserFavoritedBy")
}

model Plant {
  id        Int        @id @default(autoincrement())
  user      User       @relation(fields: [userId], references: [id])
  userId    String
  apiData   Json
  imageUrl  Json?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt @default(now())
}

model Favorite {
  id           Int    @id @default(autoincrement())
  user         User   @relation("UserFavorites", fields: [userId], references: [id])
  userId       String
  favorited    User   @relation("UserFavoritedBy", fields: [favoritedId], references: [id])
  favoritedId  String

  @@unique([userId, favoritedId])
}
```

---

## Notas importantes

- **Identificación de plantas:**  
  El endpoint `/api/plantnet` acepta múltiples imágenes y las redimensiona automáticamente antes de enviarlas a PlantNet.
- **Favoritos:**  
  El modelo `Favorite` permite que los usuarios marquen a otros usuarios como favoritos, con relaciones bidireccionales y sin duplicados.
- **Seguridad:**  
  No subas tu API key de PlantNet a repositorios públicos.

---

## Contribuir

¡Las contribuciones son bienvenidas!  
Abre un issue o pull request para sugerir mejoras, reportar bugs o proponer nuevas funcionalidades.

---

## Licencia

MIT

---

¿Dudas?  
Contacta al autor o abre un issue en el repositorio.
