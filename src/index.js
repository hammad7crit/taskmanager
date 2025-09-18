import "./main.css";
import "./styles.css";
import "./projectUI.css";
import "./taskUI.css";
import "./responsive.css";

let mainWindow = document.querySelector("#main");
let sideBar = document.querySelector("#sidebar");
let projectCreationUI = document.createElement("div");
let closeProjectOptional = document.createElement("button");
let taskCreationUI = document.createElement("div");
let taskUIOpen = false;
let projectUIOpen = false;
let currentProject = "Default Project";

let projects = JSON.parse(localStorage.getItem("projects")) || { "Default Project": [] };

Object.keys(projects).forEach(key => {
    projects[key] = projects[key].map(t => typeof t === "string" ? { name: t, completed: false } : t);
});

const saveToLocalStorage = () => {
    localStorage.setItem("projects", JSON.stringify(projects));
};

const displayHeading = function () {
    let projectButton = document.querySelector(".project-button");
    let topHeading = document.createElement("h1");
    topHeading.classList.add("top-heading");
    topHeading.innerText = projectButton.innerText;
    mainWindow.appendChild(topHeading);
    return { topHeading, projectButton };
};

const displayAddButton = function () {
    let addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.innerText = "Add a new task";
    mainWindow.appendChild(addButton);
    return addButton;
};

const displayTasks = (projectName) => {
    const existingTasks = mainWindow.querySelectorAll(".task-item");
    existingTasks.forEach(task => task.remove());

    projects[projectName].forEach((taskObj, index) => {
        if (taskObj.completed) return;

        let taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = taskObj.completed;
        checkbox.classList.add("task-checkbox");
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
            taskObj.completed = true;
            saveToLocalStorage();
            taskItem.classList.add("deleting");
            taskItem.addEventListener("animationend", () => {
            taskItem.remove();
            }, { once: true });
        } else {
            taskObj.completed = false;
            taskItem.classList.remove("completed");
            saveToLocalStorage();
            }
        });

        let taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.innerText = taskObj.name;

        let actions = document.createElement("div");
        actions.classList.add("task-actions");

        let editButton = document.createElement("button");
        editButton.classList.add("task-edit", "fa-solid", "fa-pen");
        editButton.addEventListener("click", () => editTask(taskItem, taskText, taskObj, index));

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("task-delete", "fa-solid", "fa-trash");
        deleteButton.addEventListener("click", () => deleteTask(taskItem, index));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(actions);

        mainWindow.appendChild(taskItem);
    });
};

const editTask = (taskItem, taskText, taskObj, index) => {
    let editInput = document.createElement("input");
    editInput.classList.add("task-edit-input");
    editInput.value = taskObj.name;

    let saveEdit = document.createElement("button");
    saveEdit.classList.add("task-save-edit", "fa-solid", "fa-check");

    saveEdit.addEventListener("click", () => {
        if (!editInput.value.trim()) return;
        taskObj.name = editInput.value.trim();
        taskText.innerText = taskObj.name;
        taskItem.replaceChild(taskText, editInput);
        taskItem.replaceChild(taskItem.querySelector(".task-actions"), saveEdit.parentNode);
        saveToLocalStorage();
        displayTasks(currentProject);
  });

    let actions = taskItem.querySelector(".task-actions");
    let editDiv = document.createElement("div");
    editDiv.classList.add("task-actions");
    editDiv.appendChild(saveEdit);

    taskItem.replaceChild(editInput, taskText);
    taskItem.replaceChild(editDiv, actions);
};

const deleteTask = (taskItem, index) => {
    taskItem.classList.add("deleting");
    taskItem.addEventListener("animationend", () => {
        projects[currentProject].splice(index, 1);
        saveToLocalStorage();
        displayTasks(currentProject);
    }, { once: true });
};

const optionalProjectClose = () => {
    closeProjectOptional.classList.add("closeProjectOP", "fa-solid", "fa-xmark");
    projectCreationUI.appendChild(closeProjectOptional);
};

const optionalTaskClose = () => {
    let closeTaskOptional = document.createElement("button");
    closeTaskOptional.classList.add("closeTaskOP", "fa-solid", "fa-xmark");
    taskCreationUI.appendChild(closeTaskOptional);
    return closeTaskOptional;
};

const addNewProject = () => {
    projectCreationUI.innerText = "Enter Project Name";
    projectCreationUI.classList.add("project-create-ui");

    let addProjectButton = document.querySelector(".add-project-button");

    addProjectButton.addEventListener("click", () => {
        if (taskUIOpen || projectUIOpen) return;
        projectUIOpen = true;
        mainWindow.appendChild(projectCreationUI);

        requestAnimationFrame(() => {
            projectCreationUI.classList.add("show");
        });
    });

    closeProjectOptional.addEventListener("click", () => {
        projectCreationUI.classList.remove("show");
        projectCreationUI.classList.add("hide");

        projectCreationUI.addEventListener("transitionend", function transitionHandler() {
            projectCreationUI.remove();
            projectCreationUI.classList.remove("hide");
            projectCreationUI.removeEventListener("transitionend", transitionHandler);
            projectUIOpen = false;
        }, { once: true });
    });

  return projectCreationUI;
};

const addProjectLayout = (projectCreationUI) => {
    let projectCreateDiv = document.createElement("div");
    let checkMark = document.createElement("i");
    checkMark.classList.add("check-mark", "fa-solid", "fa-check");
    projectCreateDiv.classList.add("project-create-div");

    projectCreationUI.appendChild(projectCreateDiv);
    let projectName = document.createElement("input");
    projectName.classList.add("project-inputs");
    projectCreateDiv.appendChild(projectName);
    projectCreateDiv.appendChild(checkMark);
    return { checkMark, projectName };
};

const submitProject = (checkMark, projectName, topHeading) => {
    checkMark.addEventListener("click", () => {
        if (!projectName.value.trim()) return;

        let newProjectName = projectName.value.trim();
        projects[newProjectName] = [];
        saveToLocalStorage();

        let newProjectCreated = document.createElement("button");
        newProjectCreated.classList.add("new-project-created");
        newProjectCreated.innerText = newProjectName;

        sideBar.insertBefore(newProjectCreated, sideBar.querySelector(".add-project-button"));

        newProjectCreated.addEventListener("click", () => {
            currentProject = newProjectName;
            topHeading.innerText = newProjectName;
            displayTasks(newProjectName);
        });

    projectCreationUI.classList.remove("show");
    projectCreationUI.classList.add("hide");
    projectCreationUI.addEventListener("transitionend", function transitionHandler() {
      projectCreationUI.remove();
      projectCreationUI.classList.remove("hide");
      projectCreationUI.removeEventListener("transitionend", transitionHandler);
      projectUIOpen = false;
    }, { once: true });
  });
};

const addNewTask = (addButton) => {
    addButton.addEventListener("click", () => {
        if (taskUIOpen || projectUIOpen) return;
        taskUIOpen = true;
        taskCreationUI.classList.add("task-creation-ui");
        mainWindow.appendChild(taskCreationUI);

        requestAnimationFrame(() => {
            taskCreationUI.classList.add("show");
        });
    });
    return taskCreationUI;
};

const addTaskContent = (taskCreationUI) => {
    let taskNameInputLabel = document.createElement("label");
    taskNameInputLabel.innerHTML = "Enter Task Name";
    taskNameInputLabel.style.padding = "1rem";

    let taskCreateDiv = document.createElement("div");
    taskCreateDiv.classList.add("task-create-div");

    let taskNameInput = document.createElement("input");
    taskNameInput.classList.add("task-inputs");

    let taskCheckMark = document.createElement("i");
    taskCheckMark.classList.add("task-check-mark", "fa-solid", "fa-check");

    taskCreationUI.appendChild(taskNameInputLabel);
    taskCreationUI.appendChild(taskCreateDiv);
    taskCreateDiv.appendChild(taskNameInput);
    taskCreateDiv.appendChild(taskCheckMark);

    return { taskCheckMark, taskNameInput };
};

const submitTask = (taskCheckMark, taskNameInput) => {
    taskCheckMark.addEventListener("click", () => {
        if (!taskNameInput.value.trim()) return;

        projects[currentProject].push({ name: taskNameInput.value.trim(), completed: false });
        saveToLocalStorage();
        displayTasks(currentProject);

        taskCreationUI.classList.remove("show");
        taskCreationUI.classList.add("hide");
        taskCreationUI.addEventListener("transitionend", function transitionHandler() {
            taskCreationUI.remove();
            taskCreationUI.classList.remove("hide");
            taskCreationUI.removeEventListener("transitionend", transitionHandler);
            taskUIOpen = false;
        }, { once: true });
    });
};

const loadProjects = () => {
  let projectButton = document.querySelector(".project-button");
  Object.keys(projects).forEach(project => {
    if (project !== "Default Project") {
        let newProjectCreated = document.createElement("button");
        newProjectCreated.classList.add("new-project-created");
        newProjectCreated.innerText = project;
        sideBar.insertBefore(newProjectCreated, sideBar.querySelector(".add-project-button"));
        newProjectCreated.addEventListener("click", () => {
            currentProject = project;
            topHeading.innerText = project;
            displayTasks(project);
        });
    }
});
projectButton.addEventListener("click", () => {
    currentProject = projectButton.innerText;
    topHeading.innerText = projectButton.innerText;
    displayTasks(projectButton.innerText);
    });
};

// init
const { topHeading, projectButton } = displayHeading();
const addButton = displayAddButton();
const newProject = addNewProject();
optionalProjectClose();
const { checkMark, projectName } = addProjectLayout(newProject);
submitProject(checkMark, projectName, topHeading);
const taskCreation = addNewTask(addButton);
const closeTaskOptional = optionalTaskClose();
const { taskCheckMark, taskNameInput } = addTaskContent(taskCreation);
submitTask(taskCheckMark, taskNameInput);
loadProjects();
displayTasks(currentProject);

closeTaskOptional.addEventListener("click", () => {
    taskCreationUI.classList.remove("show");
    taskCreationUI.classList.add("hide");
    taskCreationUI.addEventListener("transitionend", function transitionHandler() {
        taskCreationUI.remove();
        taskCreationUI.classList.remove("hide");
        taskCreationUI.removeEventListener("transitionend", transitionHandler);
        taskUIOpen = false;
    }, { once: true });
});