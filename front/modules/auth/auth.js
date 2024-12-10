export const set_login = () => {
    let loginbtn = document.querySelector(".login")
    
    loginbtn.addEventListener("click", () => {
        const existingAuthForm = document.querySelector(".auth-form");
        // Выходим, если окно уже открыто
        if (existingAuthForm) {
            existingAuthForm.remove();
            return;
        }

        let auth_form = document.createElement("div")
        auth_form.classList.add("auth-form")
    
        let user_name = document.createElement("input")
        user_name.placeholder = "user name"
        user_name.classList.add("user-name")
        user_name.classList.add("inputs")
        
        let password = document.createElement("input")
        password.placeholder = "password"
        password.classList.add("password")
        password.classList.add("inputs")
    
        let send_auth = document.createElement("button")
        send_auth.classList.add("btn")
        send_auth.classList.add("send-auth")
        send_auth.textContent = "login"
        send_auth.addEventListener("click", async() => {
            await send_auth_data(user_name.value, password.value)
            // Очищаем, скрываем модалку
            user_name.value = ""
            password.value = ""
            auth_form.remove()

            await fetchProtectedData()
        })
    
        auth_form.appendChild(user_name)
        auth_form.appendChild(password)
        auth_form.appendChild(send_auth)

        let rect = loginbtn.getBoundingClientRect()
        auth_form.style.top = `${rect.bottom + window.scrollY}px`
        auth_form.style.right = '16px'

        document.body.appendChild(auth_form)
    })
}

async function send_auth_data(username, password) {
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        console.log(response)
    
        if(response.ok) {
            const data = await response.json()
            window.localStorage.setItem('token', data.token)
        }
    } catch(e) {
        console.error(e)
    }
}

async function fetchProtectedData() {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/protected', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        console.error('Access denied or token expired');
    }
}