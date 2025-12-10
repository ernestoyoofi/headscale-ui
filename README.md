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
  - [ ] Update Token Key `[PATCH] /side-api/update-token-key`
  - [ ] Proxy Token Key By Jsonwebtoken
- [ ] Create Frontend (Vue.js/React.js *No plans yet*)
  - [ ] List Machine/Node
    - [ ] Change Hostname
    - [ ] Set Label
    - [ ] Delete Device
    - [ ] Set Route
  - [ ] List Users
    - [ ] Add User
    - [ ] Delete User
  - [ ] Menu ACLs
    - [ ] Editor Json
