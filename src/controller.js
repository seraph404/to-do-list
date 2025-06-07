import { View } from "./view.js";
import { Model } from "./model.js";

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.registerViewEvents();
  }
  // this makes the following methods available to 'View'
  registerViewEvents() {
    this.view.bindOnAdd(this.onAdd.bind(this));
    this.view.bindOnEdit(this.onEdit.bind(this));
    this.view.bindOnDelete(this.onDelete.bind(this));
  }

  onAdd({ id, title, description, dueDate, priority }) {
    // send directive to model
    this.model.addTodo({ id, title, description, dueDate, priority });
  }

  onEdit({ id, title, description, dueDate, priority }) {
    // check if to-do item exists
    if (this.todoExists(id)) {
      console.log("To-do exists! Proceed with editing.");
      // send directive to model
      this.model.editTodo({ id, title, description, dueDate, priority });
    }
  }

  onDelete({ id, title, description, dueDate, priority }) {
    if (this.todoExists(id)) {
      console.log("To-do exists! Proceed with deleting.");
      // send directive to model
      this.model.deleteTodo({ id, title, description, dueDate, priority });
    }
  }

  todoExists(id) {
    return this.model.todoItems.some((todo) => todo.id === id);
  }
}
