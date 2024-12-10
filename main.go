package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	"schedule/internal/backlog"
	"schedule/internal/homepage"
	"schedule/internal/updateusers"
)

func main() {
	mux := mux.NewRouter()
	mux.HandleFunc("/", homepage.Home)
	mux.HandleFunc("/login", homepage.Login)
	mux.Handle("/getAllUsers", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		users, err := homepage.Get_all_users()
		if err != nil {
			log.Fatal(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		usersJSON, err := json.Marshal(users)
		if err != nil {
			log.Fatal(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		w.Write(usersJSON)
	}))
	mux.HandleFunc("/updateData", updateusers.Update_users)

	mux.HandleFunc("/getCurrentBacklog", backlog.GetCurrentBacklog)
	mux.HandleFunc("/createBacklog", backlog.Create_backlog)
	mux.HandleFunc("/deleteFromBacklog", backlog.Delete_backlog)

	key := os.Getenv("HTTPSKEY")
	cert := os.Getenv("HTTPSCERT")

	http.ListenAndServeTLS(":8090", cert, key, mux)
}
