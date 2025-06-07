import "./styles.css";

import { Model } from "./model.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";

/* DOM elements */
const todoItemsDiv = document.querySelector(".todo-items");
const addItemBtn = document.querySelector("[data-action='add']");

/* initiate modules */
const model = new Model();
window.model = model; // allows me to test in browser console
const view = new View({
  addButton: addItemBtn,
  todoItems: todoItemsDiv,
});
const controller = new Controller(model, view);
window.controller = controller; // allows me to test in browser console
