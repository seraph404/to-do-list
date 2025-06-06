import { Controller } from "./controller.js";

export class View {
  constructor({ addButton, todoItems }) {
    this.addButton = addButton;
    this.todoItems = todoItems;
    this.handleClick = this.handleClick.bind(this);

    /* event listeners */
    this.addButton.addEventListener("click", this.handleClick);
    this.todoItems.addEventListener("click", this.handleClick);
  }

  bindOnAdd(handler) {
    this.onAdd = handler; // store the callback
  }

  bindOnEdit(handler) {
    this.onEdit = handler;
  }

  bindOnDelete(handler) {
    this.onDelete = handler;
  }

  handleClick(event) {
    const target = event.target;
    const action = target.dataset.action;
    console.log(event.target);
    if (action === "add") {
      this.onAdd();
    } else if (action === "edit") {
      console.log("Editing!");
    } else if (action === "delete") {
      console.log("Deleting!");
    }
  }
} // class end
