FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json backend/
RUN npm install

FROM deps AS build
COPY backend backend
RUN npm run build --workspace backend

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY backend/package*.json backend/
RUN npm install --omit=dev --workspace backend
COPY --from=build /app/backend/dist backend/dist
COPY backend/prisma backend/prisma
EXPOSE 8080
CMD ["npm", "run", "start", "--workspace", "backend"]
