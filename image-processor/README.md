# Image Processor

Microservicio Nest que recibe imágenes en base64 y aplica operaciones con sharp.

Endpoints

- POST /process
  - Body: { image: string (base64 or data:<mime>;base64,<data>), operations?: { resize?: {width?: number, height?: number}, format?: string } }
  - Returns: { image: string } (data:<mime>;base64,...)

Cómo ejecutar

1. Instalar dependencias

```bash
cd image-processor
npm install
```

2. Ejecutar en desarrollo

```bash
npm run start:dev
```

3. Probar

```bash
npm run test
```

Docker

Construir: `docker build -t image-processor .`
Ejecutar: `docker run -p 4000:4000 image-processor`
