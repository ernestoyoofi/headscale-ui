# Headscale UI

Headscale management with a web UI featuring a simple menu.

> [!IMPORTANT]
> Currently in progress...

## Tasks

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
