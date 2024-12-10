import * as FormatDate from "../format_date/FormatDate.js"

function appendRow(name, id, task_columns) {
    // Создаем ячейку для имени
    const nameCell = document.createElement('div');
    nameCell.textContent = name;
    nameCell.dataset.id = id
    task_columns.appendChild(nameCell);

    // Создаем ячейки для дней недели
    for (let i = 0; i < 7; i++) {
        const cell = document.createElement('div');
        cell.classList.add("task-field")
        cell.dataset.id = id

        // cell.contentEditable = true; // Можно редактировать
        cell.addEventListener("blur", (event) => {

        })

        task_columns.appendChild(cell);
    }
    return nameCell
}

export function SetDatesLine(task_columns, weekDates, users) {
    task_columns.innerHTML = ""

    const datesLine = document.querySelector(".schedule__dates");

    if (weekDates && weekDates.length > 0) {
        let emptyField = document.createElement("div")
        emptyField.classList.add("task-column")
        task_columns.appendChild(emptyField)

        for (let i = 0; i < weekDates.length; i++) {
            let ncolumn = document.createElement("div")
            ncolumn.classList.add("task-column")
            ncolumn.dataset.id = FormatDate.format_date(weekDates[i])
            ncolumn.dataset.colindex = i

            // set dates
            let dateItem = document.createElement("div")
            dateItem.classList.add("date-item")
            dateItem.dataset.id = i
            dateItem.textContent = FormatDate.format_date(weekDates[i])
            datesLine.appendChild(dateItem)

            ncolumn.appendChild(dateItem)

            task_columns.appendChild(ncolumn)
        }
    }

    if (users && users.length > 0) {
        for (let us of users) {
            let name_cell = appendRow(us.name, us.id, task_columns)

            if (us.tasks && us.tasks.length > 0) {
                for (let task of us.tasks) {
                    let start = FormatDate.format_date(new Date(task.startDate))
                    let col = document.querySelector(`.task-column[data-id='${start}']`)
                    if (col) {
                        // Write task to cell
                        let ntask = document.createElement("div")
                        ntask.dataset.id = task.id
                        ntask.textContent = task.title
                        ntask.classList.add("task")
                        ntask.dataset.tooltip = task.description

                        let row = name_cell.parentElement
                        let task_fields = Array.from(row.querySelectorAll(".task-field[data-id='" + us.id + "']"))
                        if (task_fields && task_fields.length > 0) {
                            let cell = task_fields[col.dataset.colindex]
                            cell.appendChild(ntask)
                        }
                    }
                }
            }
        }
    }
}