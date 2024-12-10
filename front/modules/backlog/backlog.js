import {format_date} from "../format_date/FormatDate.js"

async function write(backlog) {
    if (!backlog) return;
    
    let backlog_tasks = []
    await fetch("../../backlog.json")
        .then(e => e.json())
        .then(d => backlog_tasks = d)
    if (backlog_tasks && backlog_tasks.length > 0) {
        let backlog_container = document.querySelector(".backlog-items-container")
        backlog_container.innerHTML = ""
    
        for (let item of backlog_tasks) {
            let backlog_item = document.createElement("div")
            backlog_item.classList.add("backlog-item")
            backlog_item.dataset.id = item.id
            backlog_item.draggable = true
    
            let name = document.createElement("b")
            name.classList.add("backlog-name")
            name.textContent = item.title
            backlog_item.appendChild(name)
    
            let description = document.createElement("p")
            description.classList.add("backlog-desription")
            description.textContent = item.description
            backlog_item.appendChild(description)
    
            backlog_item.dataset.start = item.startDate
            backlog_item.dataset.end = item.endDate
    
            backlog_container.appendChild(backlog_item)
        }
    }
    return backlog_tasks
}

export const write_backlog = async (backlog) => {
    return await write(backlog)
}

export const actions_backlog = () => {
    // Search in backlog
    document.querySelector(".search-backlog")
    .addEventListener("keyup", (event) => {
        if (event.target.value) {
            document.querySelectorAll(".backlog-item").forEach(e => {
                if (e.querySelector(".backlog-name")
                    .textContent.toLowerCase()
                    .includes(event.target.value.toLowerCase()) == false) {
                    e.style.display = "none"
                }
            })
        } else {
            document.querySelectorAll(".backlog-item").forEach(e => {
                e.style.display = "block"
            })
        }
        search_actions(event)
    })

    let is_form_backlog_open = false
    document.querySelector(".open-form-new-backlog-task").addEventListener("click", () => {
        is_form_backlog_open = !is_form_backlog_open
        if (is_form_backlog_open) {
            document.querySelector(".form-new-backlog-task").style.display = "flex"
        } else {
            document.querySelector(".form-new-backlog-task").style.display = "none"
        }
    })

    // create new backlog task
    document.querySelector(".create-new-backlog-task").addEventListener("click", async() => {
        let name = document.querySelector(".form-new-backlog-task__name")
        let descript = document.querySelector(".form-new-backlog-task__descript")
        let start = document.querySelector(".form-new-backlog-task__start")
        let end = document.querySelector(".form-new-backlog-task__end")

        const miniID = () => {
            let firstPart = (Math.random() * 46656) | 0;
            let secondPart = (Math.random() * 46656) | 0;
            firstPart = ("000" + firstPart.toString(36)).slice(-3);
            secondPart = ("000" + secondPart.toString(36)).slice(-3);
            return firstPart + secondPart;
        };

        let n_backlog = {
            id: miniID(),
            title: name ? name.value : "",
            description: descript ? descript.value : "",
            startDate: start ? start.value: "",
            endDate: end ? end.value: ""
        }

        let cur_backlog = JSON.parse(await get_current_backlog())

        if(cur_backlog && cur_backlog.some(e => e.title == n_backlog.title) == false) {
            cur_backlog.push(n_backlog)
        }

        try {
            fetch("/createBacklog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cur_backlog)
            })
            .then(e => e.status + " " + e.statusText)
            .then(d => console.log(d))
            .catch(er => console.error(er))
        } catch(e) {
            console.error('createBacklog: ', e.message)
        }

        const schedule_backlog = document.querySelector(".schedule__backlog");
        await write(schedule_backlog)
    })
}

export async function get_current_backlog() {
    let backlog_data = []
    await fetch("/getCurrentBacklog", {
        method: "POST"
    })
    .then(e => e.json())
    .then(d => backlog_data = d)
    .catch(e => console.log(e))
    return backlog_data
}