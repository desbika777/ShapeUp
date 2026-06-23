FROM node:22-alpine AS deps

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json

RUN npm ci

FROM deps AS build

COPY shared shared
COPY backend backend

RUN npm run build --workspace shared
RUN npm run prisma:generate --workspace backend
RUN npm run build --workspace backend

FROM node:22-alpine AS production-deps

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-deps /app/package.json ./package.json
COPY --from=production-deps /app/backend/package.json ./backend/package.json
COPY --from=production-deps /app/shared/package.json ./shared/package.json
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma

WORKDIR /app/backend
EXPOSE 3333

CMD ["node", "dist/server.js"]
