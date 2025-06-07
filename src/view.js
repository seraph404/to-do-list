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
    this.onAdd = handler;
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

    if (action === "add") {
      this.showModal();
      //this.onAdd();
    } else if (action === "edit") {
      this.onEdit();
    } else if (action === "delete") {
      this.onDelete();
    }
  }

  showModal() {
    console.log("A modal displays!");
    /* create the modal */
  }
} // class end
