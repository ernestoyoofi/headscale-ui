# Build Frontend
FROM node:lts-alpine AS build_frontend

WORKDIR /app/frontend

COPY ./frontend/ ./
RUN npm install
RUN npm run build

# Build Backend & Server Proxy
FROM golang:1.25-alpine AS build_backend

WORKDIR /app/backend

COPY ./backend/ ./
ENV PRODUCTION_BUILD="true"
RUN go mod tidy
RUN go build -ldflags "-X main.Version=1.0.1-release" -o /app/backend/serverbin ./cmd/server

# Run On Production
FROM alpine AS base_headscaleui

WORKDIR /app

ENV DIST_FRONTEND=/app/html
ENV RE_GENERATE_R=/app/secret/jwt-token
ENV SQLITE_LOCATION=/app/database/database.db
ENV NODE_ENV=production
ENV APP_MODE=production

COPY --from=build_frontend /app/frontend/dist/ /app/html
COPY --from=build_frontend /app/frontend/public/ /app/html
COPY --from=build_backend /app/backend/serverbin /app/server

EXPOSE 3050
ENTRYPOINT ["/app/server"]