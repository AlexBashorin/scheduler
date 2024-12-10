package homepage

import (
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

func Get_all_users() ([]Users, error) {
	var users []Users
	query := "SELECT * FROM users"

	rows, err := connectdb.Conn().Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user Users
		if err := rows.Scan(&user.ID, &user.Name, &user.Tasks); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
