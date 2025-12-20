# Headscale UI

Headscale management with a web UI featuring a simple menu.

> [!IMPORTANT]
> Currently in progress...

## Tasks

- [ ] Create Backend for proxy (With Golang)
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
  - [ ] Setup Middleware
  - [ ] Set Token Key
  - [X] Login
  - [ ] Logout (Next Version)
  - [ ] Menu Settings
  - [ ] List Machine/Node
    - [ ] Get Nodes
    - [ ] Get Node (ID)
    - [ ] Register Node
    - [ ] Approve Routes
    - [ ] Rename Node
    - [ ] Set Tags
  - [ ] List Users
    - [ ] Create User
    - [ ] Rename User
    - [ ] Delete User
  - [ ] Menu ACLs
    - [ ] Editor Json
