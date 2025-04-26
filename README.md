# Plant App - Tu Jardín Digital

Una aplicación web para aprender sobre plantas y cuidar tu jardín.

## Estructura del Proyecto

```
app/
├── components/          # Componentes reutilizables
│   └── plants/         # Componentes específicos de plantas
│       └── PlantCard.js
├── lib/                # Utilidades y configuraciones
│   └── api/           # Funciones de la API
│       └── plants.js
├── page.js            # Página principal
├── layout.js          # Layout principal
└── globals.css        # Estilos globales
```

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` con tu API key:
   ```
   NEXT_PUBLIC_PLANTNET_API_KEY=tu_api_key_aquí
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Tecnologías Utilizadas

- Next.js 14
- Tailwind CSS
- PlantNet API

## Características

- Visualización de plantas
- Identificación de plantas por imagen
- Interfaz moderna y responsiva
- Diseño centrado en la experiencia de usuario

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.
