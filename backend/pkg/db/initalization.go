package db

import (
  "database/sql"
  "log"
  "os"
  "sync"

  // _ "github.com/mattn/go-sqlite3"
  _ "modernc.org/sqlite"
)

type UserData struct {
  UserId    int    `json:"id"`
  Username  string `json:"username"`
  Password  string `json:"password"`
  ApiKey    string `json:"apikey"`
  SessionId string `json:"session_id"`
}

var db * sql.DB
var once sync.Once

func GetDatabase() (*sql.DB) {
  sqllocation := "./database-local.db"
  if os.Getenv("SQLITE_LOCATION") != "" {
    sqllocation = os.Getenv("SQLITE_LOCATION")
  }

  once.Do(func() {
    dbq, err := sql.Open("sqlite", sqllocation)
    if err != nil {
      log.Fatal("[database] SQL Error:", err)
    }
    db = dbq

    // Enable Write-Ahead Logging (WAL) mode for SQLite
    _, err = db.Exec("PRAGMA journal_mode=WAL;")
    if err != nil {
      log.Fatal("[database] Failed to enable WAL mode:", err)
    }
  })

  return db
}

func InitDB() {
  GetDatabase()

  setupTable := `CREATE TABLE IF NOT EXISTS admin (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    apikey TEXT,
    session_id TEXT
  );`

  _, err := db.Exec(setupTable)
  if err != nil {
    log.Fatalf("[database]: Error create table: %q\n", err)
  }
  log.Println("[database]: Success setup!")
}