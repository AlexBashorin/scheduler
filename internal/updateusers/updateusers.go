package updateusers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"schedule/internal/connectdb"
)

type UserTasks struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}

type Users struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Tasks []UserTasks
}

func Update_users(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	bod, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	defer r.Body.Close()

	var upd_users []Users
	unmarsh_err := json.Unmarshal(bod, &upd_users)
	if unmarsh_err != nil {
		log.Fatal(unmarsh_err)
	}

	tx, err := connectdb.Conn().BeginTx(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	for _, user := range upd_users {
		_, err := tx.Exec("UPDATE users SET tasks = ? WHERE id = ?", user.Tasks, user.ID)
		if err != nil {
			tx.Rollback()
			log.Fatal(err)
		}
	}
	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
}
