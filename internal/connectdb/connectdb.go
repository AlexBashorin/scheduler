package connectdb

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func Conn() *sql.DB {
	db, err := sql.Open("mysql", "root:bash61712909@tcp(170.64.186.81:3306)/projtasks")
	if err != nil {
		log.Fatal(err)
	}
	db.Close()

	return db
}
