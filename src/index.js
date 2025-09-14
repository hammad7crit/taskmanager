
import "./styles.css";
import "./main.css";
import "./taskUI.css";
let mainWindow = document.querySelector("#main");
let sideBar = document.querySelector("#sidebar");
let projectCreationUI = document.createElement("div");
let closeProjectOptional = document.createElement("button");

const displayHeading = function () {
    let projectButton = document.querySelector(".project-button");
    let topHeading = document.createElement("h1");
    topHeading.classList.add("top-heading");
    topHeading.innerText = projectButton.innerText;
    mainWindow.appendChild(topHeading);
    return {topHeading, projectButton};
};
    
const displayAddButton = function () {
    let addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.innerText = "Add a new task";
    mainWindow.appendChild(addButton);
};


const optionalProjectClose = () => {
    closeProjectOptional.classList.add("closeProjectOP");
    closeProjectOptional.classList.add("fa-solid", "fa-xmark");
    projectCreationUI.appendChild(closeProjectOptional); 
};

const addNewProject = () => {
    projectCreationUI.innerText = "Enter Project Name";
    
    let buttonClicked = false;
    let addProjectButton = document.querySelector(".add-project-button");
    addProjectButton.addEventListener("click", () => {
        if (buttonClicked === false) {
            projectCreationUI.classList.add("project-create-ui");
            mainWindow.appendChild(projectCreationUI);

            requestAnimationFrame(() => {
                projectCreationUI.classList.add("show");
            });
        };
    });
    
    closeProjectOptional.addEventListener("click", () => {
    
        projectCreationUI.classList.remove("show");
        projectCreationUI.classList.add("hide");

        projectCreationUI.addEventListener("transitionend", function transitionHandler () {
            projectCreationUI.remove();
            projectCreationUI.classList.remove("hide");
            projectCreationUI.removeEventListener("transitionend", transitionHandler);
        })
        
    });
    return projectCreationUI;
};

const addProjectLayout = (projectCreationUI) => {
    const projectCreateDiv = document.createElement("div");
    const checkMark = document.createElement("i");
    checkMark.classList.add("check-mark");

    checkMark.classList.add("fa-solid", "fa-check");
    projectCreateDiv.classList.add("project-create-div");

    projectCreationUI.appendChild(projectCreateDiv);
    const projectName = document.createElement("input");

    projectName.classList.add("project-inputs");
    projectCreateDiv.appendChild(projectName);
    projectCreateDiv.appendChild(checkMark);
    return {checkMark, projectName}
};

const submitProject = (checkMark, projectName, headingDisplay, projectButton) => {
    checkMark.addEventListener("click", () => {
        const newProjectCreated = document.createElement("button");
        newProjectCreated.classList.add("new-project-created");
        newProjectCreated.innerText = projectName.value; 

        const buttons = sideBar.querySelectorAll("button");

        if (buttons.length >= 2) {
            sideBar.insertBefore(newProjectCreated, buttons[1]);
        } else {
            sideBar.appendChild(newProjectCreated);
        }
        newProjectCreated.addEventListener("click", () => {
            headingDisplay.innerText = newProjectCreated.innerText;
        });
    });

    projectButton.addEventListener("click", () => {
        headingDisplay.innerText = projectButton.innerText;
    });
};







const newProject = addNewProject();
const {topHeading, projectButton} = displayHeading();
displayAddButton();
optionalProjectClose();
const {checkMark, projectName} = addProjectLayout(newProject);
submitProject(checkMark, projectName, topHeading, projectButton);
