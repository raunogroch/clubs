## Frontend multi-stage Dockerfile (builder + runner)
## - Exposes Vite build-time variables via build args
## - Builds the app with Node, serves with nginx

# Build arguments (passed from docker-compose or CLI)
ARG VITE_BACKEND_URI
ARG VITE_IMAGE_PROCESSOR_API

FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Make build args available as env vars so Vite can pick them up at build time
ARG VITE_BACKEND_URI
ARG VITE_IMAGE_PROCESSOR_API

ENV VITE_BACKEND_URI=${VITE_BACKEND_URI}
ENV VITE_IMAGE_PROCESSOR_API=${VITE_IMAGE_PROCESSOR_API}

# Install deps and build
COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

## Production image: lightweight nginx serving static files
FROM nginx:stable-alpine AS runner
LABEL maintainer=""
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
