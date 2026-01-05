FROM node:20-bullseye as builder
WORKDIR /usr/src/app

# Install dependencies required by sharp
RUN apt-get update && apt-get install -y python3 build-essential libvips-dev git && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-bullseye-slim
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/main.js"]
