# Headscale UI

> [!IMPORTANT]
> **Work in Progress:** This project is currently under active development. Some features may be unstable or incomplete.

A lightweight web interface for managing your [Headscale](https://github.com/juanfont/headscale) server, built with Go (Backend) and React (Frontend). It acts as a secure proxy to the Headscale API.

## ✨ Features

- **Node Management**: List, register, remove, and rename nodes. Support for approving subnets/routes.
- **User Control**: Easily create, rename, and manage users (namespaces).
- **Access Control (ACL)**: Built-in JSON editor to limit and control device access within your tailnet.
- **Secure Backend**: Simple authentication and JWT-based proxying to keep your Headscale API key safe.

## ⚠️ Limitations

While this UI covers most daily operations, please keep the following in mind:

- **CLI/File Access Required**: Certain advanced configurations, such as **DNS** and **Base Domain** settings, cannot be managed via the Headscale API yet. You will still need access to the server's CLI or configuration files for these tasks.
- **Docker-First Design**: This project is optimized for **Docker environments**. Running it directly on a host machine is not officially supported or recommended at this time.

## 🚀 Getting Started

### Prerequisites

- A Linux server.
- Docker & Docker Compose.
- An existing Headscale server and an API Key.
- Golang, Nodejs/Bun, C Compailer (If running on host machine)

### Installation via Docker

The easiest way to deploy Headscale UI is using Docker:

```bash
docker run -d \
  --name headscale-ui \
  -p 3050:3050 \
  -e HEADSCALE_URL="https://your-headscale-domain.com" \
  -e HEADSCALE_API_KEY="your-api-key-here" \
  -e SERVER_LISTEN=":3050" \
  ernestoyoofi/headscale-ui:latest
```

> [!WARNING]
> This project is optimized for Docker. Running it directly on a host machine is possible using the method below, but it is **not recommended** for production environments.

### Host Environment (Not Recommend)

1. Clone the Repository

   ```bash
   git clone https://github.com/ernestoyoofi/headscale-ui.git
   cd headscale-ui
   ```

   You need a golang, bun/nodejs and C to build this.

2. Build the Backend.

   ```bash
   cd backend
   go build -o headscaleui-host ./cmd/server
   chmod +x ./headscaleui-host
   sudo cp ./headscaleui-host /usr/local/bin/headscale-ui
   cd ..
   ```

3. Build the frontend.

   Using Node.js/NPM:

   ```bash
   cd frontend
   npm install
   npm run build
   sudo mkdir -p /root/headscale-ui/app/
   sudo mkdir -p /var/www/headscale-ui
   sudo cp -r ./dist/* /var/www/headscale-ui/
   rm -r ./dist
   cd ..
   ```

   Using Bun:

   ```bash
   cd frontend
   bun install
   bun run build
   sudo mkdir -p /root/headscale-ui/app/
   sudo mkdir -p /var/www/headscale-ui
   sudo cp -r ./dist/* /var/www/headscale-ui/
   rm -r ./dist
   cd ..
   ```

4. Systemd Service Configuration

   Create a service file at `/etc/systemd/system/headscale-ui.service`:

   ```text
   [Unit]
   Description=Headscale UI Service
   After=network.target
   
   [Service]
   Type=simple
   User=root
   WorkingDirectory=/var/lib/headscale-ui
   ExecStart=/usr/local/bin/headscale-ui
   Restart=on-failure
   RestartSec=2s
   
   # Environment Configurations
   Environment=SQLITE_LOCATION=/var/lib/headscale-ui/database.db
   Environment=UNJWT_SECRET=/var/lib/headscale-ui/jwt-token
   Environment=DIST_FRONTEND=/var/www/headscale-ui
   Environment=HEADSCALE_SERVER=http://localhost:8080
   Environment=SERVER_LISTEN=:3050
   
   [Install]
   WantedBy=multi-user.target
   ```

5. Enable and Start Service
  
   ```bash
   sudo mkdir -p /var/lib/headscale-ui
   sudo systemctl daemon-reload
   sudo systemctl enable --now headscale-ui
   ```

6. Access the dashboard via your IP or domain (Port 3050).
7. Complete the Admin Account setup on the first run.
8. Input your Headscale API Key in the settings menu.

### Docker Compose Setup

1. Add the headscale-ui service to your existing docker-compose.yml. You can see a full example [here.](https://github.com/tkjskanesga/headscale-config/blob/main/docker-compose-run.yml)

   ```yml
   headscale_ui:
    image: ernestoyoofi/headscale-ui:latest
    container_name: headscale-ui
    restart: unless-stopped
    networks:
      - headscale
    volumes:
      - ${PWD}/headscale-ui/database:/app/database
      - ${PWD}/headscale-ui/secret:/app/secret
    environment:
      - JWT_SECRET="PleaseAddYourSecretJwtToken" # Jwt Token
      - SERVER_LISTEN=":3050" # Server Listening
      - HEADSCALE_SERVER="headscale:8080" # Headscale Service Network
    labels:
      # If Usage Traefik Proxy
      - "traefik.enable=true"
      - "traefik.http.routers.headscale-ui.rule=Host(`login.tailscale.yourdomain.com`)"
      - "traefik.http.routers.headscale-ui.entrypoints=websecure"
      - "traefik.http.routers.headscale-ui.tls.certresolver=cloudflare"
      - "traefik.http.services.headscale-ui.loadbalancer.server.port=3050"
   ```

2. Run `docker-compose up -d.`
3. Access the dashboard via your configured domain or IP.
4. On the first run, set up your Admin Account (Username & Password).
5. Input your Headscale API Key in the settings menu to start managing your network.

## ⚙️ Environment / Configuration

| Variable | Description | Requirement |
| -------- | ----------- | ----------- |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | Optional (Recommended) |
| `SERVER_LISTEN` | The address and port the UI listens on (e.g., `:3050`) | **Required** |
| `HEADSCALE_SERVER` | Address of your Headscale API (e.g., `headscale:8080`) | **Required** |

> [!IMPORTANT]
> **Work in Progress:** This project is currently under active development. Some features may be unstable or incomplete.

## 🛠 Development Roadmap

- [x] Create Backend for proxy (With Golang)
  - [x] Create Base All Database (SQLite)
  - [x] Setup HTTP
  - [x] Health Check /health
  - [x] Middleware Checker `[GET] /side-api/md-checker`
  - [x] New Default Admin `[POST] /side-api/new-default-admin`
  - [x] Sign In Account `[POST] /side-api/login`
  - [x] Update Password `[PATCH] /side-api/update-password`
  - [x] Update Token Key `[PATCH] /side-api/update-token-key`
  - [x] Proxy Token Key By Jsonwebtoken
- [x] Create Frontend (React.js)
  - [X] Setup Admin
  - [x] Setup Middleware
  - [x] Set Token Key
  - [X] Login
  - [x] Menu Settings
  - [x] List Machine/Node
    - [ ] Get Nodes
    - [ ] Get Node (ID)
    - [ ] Register Node
    - [ ] Approve Routes
    - [ ] Rename Node
    - [ ] Set Tags
  - [x] List Users
    - [x] Create User
    - [x] Rename User
    - [x] Delete User
  - [x] Menu ACLs
    - [x] Editor Json

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page.](https://github.com/ernestoyoofi/headscale-ui/issues)

1. Fork the Project
2. Create your Feature Branch `(git checkout -b feature/AmazingFeature)`
3. Commit your Changes `(git commit -m 'Add some AmazingFeature')`
4. Push to the Branch `(git push origin feature/AmazingFeature)`
5. Open a Pull Request

## 📄 License

Distributed under the **Apache 2.0**. See [LICENSE for more information](./LICENSE).
