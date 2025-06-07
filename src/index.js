import "./styles.css";

import { Model } from "./model.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";

/* DOM elements */
const todoItemsDiv = document.querySelector(".todo-items");
const openModalBtn = document.querySelector("[data-action='open-modal']");
const createTodoBtn = document.querySelector("[data-action='create-todo']");
const cancelTodoBtn = document.querySelector("[data-action='cancel-todo']");

/* initiate modules */
const model = new Model();
window.model = model; // allows me to test in browser console
const view = new View({
  openModalBtn: openModalBtn,
  todoItems: todoItemsDiv,
  createTodoBtn: createTodoBtn,
  cancelTodoBtn: cancelTodoBtn,
});
const controller = new Controller(model, view);
window.controller = controller; // allows me to test in browser console
