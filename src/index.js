import "./styles.css";

import { Model } from "./model.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";

/* DOM elements */
const todoItemsDiv = document.querySelector(".todo-items");
const openModalBtn = document.querySelector("[data-action='open-create-todo']");
const todoForm = document.querySelector("#todo-form");

/* initiate modules */
const model = new Model();
const view = new View({
  openModalBtn: openModalBtn,
  todoItems: todoItemsDiv,
  todoForm: todoForm,
});
const controller = new Controller(model, view);

controller.initializeApp();
