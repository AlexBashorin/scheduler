package homepage

import "net/http"

func Home(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../../index.html")
}
