import "./styles.css";
import "./main.css";
import { mainWindow } from "./domElements.js";
import addNewProject from "./project.js";

const displayHeading = function() {
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

displayHeading();
displayAddButton();
addNewProject();
