import "./styles.css";
import "./main.css";
import "./taskUI.css";
let mainWindow = document.querySelector("#main");
let projectCreationUI = document.createElement("div");
let closeProjectOptional = document.createElement("button");

const displayHeading = function () {
    let projectButton = document.querySelector(".project-button");
    let topHeading = document.createElement("h1");
    topHeading.classList.add("top-heading");
    topHeading.innerText = projectButton.innerText;
    mainWindow.appendChild(topHeading);
};
    
const displayAddButton = function () {
    let addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.innerText = "Add a new task";
    mainWindow.appendChild(addButton);
};


const optionalProjectClose = () => {
    let optionalCloseDiv = document.createElement("div");
    optionalCloseDiv.classList.add("optional-close-div");
    projectCreationUI.appendChild(optionalCloseDiv);

    closeProjectOptional.classList.add("closeProjectOP");
    closeProjectOptional.classList.add("fa-solid", "fa-xmark");
    optionalCloseDiv.appendChild(closeProjectOptional);
};

const addNewProject = () => {
    let buttonClicked = false;
    let addProjectButton = document.querySelector(".add-project-button");
    addProjectButton.addEventListener("click", () => {
        if (buttonClicked === false) {
            buttonClicked === true;
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
};


addNewProject();
displayHeading();
displayAddButton();
optionalProjectClose();
