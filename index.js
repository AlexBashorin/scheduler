import { get_dates } from "./modules/get_dates/GetDates.js"
import * as Backlog from "./modules/backlog/backlog.js"
import * as Auth from "./modules/auth/auth.js"
import * as Lines from "./modules/set_lines/set_lines.js"
import * as DND from "./modules/drag_n_drop/drag_n_drop.js"
import * as Users from "./modules/auth/user_model.js"

const task_columns = document.querySelector(".schedule__task-columns");

// Set backlog
const schedule_backlog = document.querySelector(".schedule__backlog");
let backlog_tasks = await Backlog.write_backlog(schedule_backlog);
Backlog.actions_backlog()

// Auth
Auth.set_login()

let currentWeekOffset = 0;

let requset_users = await fetch("/getAllUsers")
if (!requset_users.ok) {
    alert("Can't get users: " + requset_users.status + " " + requset_users.statusText)
    return
}
let users = await requset_users.json()
// let users = []
// let users = await Users.Get_all_users()
// await fetch("./data.json")
//     .then(e => e.json())
//     .then(d => users = d)

// Get week days
let weekDates = get_dates(currentWeekOffset)

// Set dates, users lines
Lines.SetDatesLine(task_columns, weekDates, users)

// Listeneres for switch weeks
function change_week(increment) {
    currentWeekOffset = currentWeekOffset + increment
    weekDates = get_dates(currentWeekOffset)
    Lines.SetDatesLine(task_columns, weekDates, users)
}

document.querySelector('.schedule__header-prev-week').addEventListener("click", () => {
    change_week(-1)
    DND.SetupDragAndDrop(users)
})
document.querySelector('.schedule__header-next-week').addEventListener("click", () => {
    change_week(1)
    DND.SetupDragAndDrop(users)
})
document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowLeft") change_week(-1);
    if (event.key == "ArrowRight") change_week(1);
})

// DND
DND.SetupDragAndDrop(users)