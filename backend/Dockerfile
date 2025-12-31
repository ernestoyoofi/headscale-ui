# Backend Build
FROM golang:1.25-alpine AS build_backend

WORKDIR /app/backend

COPY ./ ./
ENV PRODUCTION_BUILD="true"
RUN go mod tidy
RUN go build -ldflags "-X main.Version=v1.0.0-beta" -o /app/backend/serverbin ./cmd/server

FROM alpine AS backend_headscaleui

WORKDIR /app

ENV DIST_FRONTEND=/app/html
ENV RE_GENERATE_R=/app/secret/jwt-token
ENV SQLITE_LOCATION=/app/database/database.db
ENV NODE_ENV=production
ENV APP_MODE=production

COPY --from=build_backend /app/backend/serverbin /app/server

EXPOSE 3050
ENTRYPOINT ["/app/server"]