export function SetupDragAndDrop(users) {
    const draggableElements = document.querySelectorAll('.backlog-item');
    const dropZones = document.querySelectorAll('.task-field');

    draggableElements.forEach(elem => {
        elem.addEventListener('dragstart', handleDragStart);
        elem.addEventListener('dragend', handleDragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop(e, users));
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    // let img = new Image()
    // e.dataTransfer.setDragImage(img, 80, 20)
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("application/task", e.target.dataset.id)
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// fields
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drop-zone');
}

function handleDragLeave(e) {
    e.target.classList.remove('drop-zone');
}

function handleDrop(e, users) {
    e.preventDefault();
    // Зона сбрасывания (ячейка для задачи)
    const dropZone = e.target;
    dropZone.classList.remove('drop-zone');

    // Переносимый бэклог
    const draggedTask = document.querySelector('.dragging');
    const taskText = draggedTask.textContent;

    // wr task to user
    let user = users.find(e => e.id == dropZone.dataset.id)
    if (user) {
        let id_backlog = draggedTask.dataset.id
        let title_backlog = draggedTask.querySelector(".backlog-name")?.textContent
        let description = draggedTask.querySelector(".backlog-desription")?.textContent
        if (user.tasks && user.tasks.length > 0 && user.tasks.some(e => e.title != title_backlog) == true) {
            user.tasks.push(
                {
                    "id": id_backlog,
                    "title": title_backlog,
                    "description": description,
                    "startDate": draggedTask.dataset.start,
                    "endDate": draggedTask.dataset.end
                },
            )

            fetch("/updateData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(users)
            })
                .then(response => {
                    if (!response.ok) {
                        console.error("Cannot upd user's data.json: ", response.statusText)
                    }
                })
                .then(data => console.log(data))
                .catch(error => console.error("Problem with upd user's data.json: ", error))

            // delete from backlog
            backlog_tasks = backlog_tasks.filter(e => e.id != id_backlog)
            fetch("/deleteFromBacklog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(backlog_tasks)
            })
                .then(data => console.log(data))
                .catch(e => console.error("Problem with delete from backlog.json: ", e))
                
            // Удаление backlog item из исходного места
            if (draggedTask.parentElement) {
                draggedTask.parentElement.removeChild(draggedTask);
            }
        }
    }

    // Добавление в целевую ячейку
    const taskItem = document.createElement("div");
    taskItem.textContent = taskText;
    taskItem.classList.add("task");

    let descript_back = draggedTask.querySelector(".backlog-desription")
    if (descript_back) {
        taskItem.dataset.tooltip = descript_back.textContent
    }
    dropZone.appendChild(taskItem);
}