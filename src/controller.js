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
    id = this.generateId();
    try {
      id = this.generateId();
      this.validateInput({ id, title, description, dueDate, priority });
      this.model.addTodo({ id, title, description, dueDate, priority });
      this.view.closeModal();
    } catch (error) {
      console.error("Validation failed!", error);
    }
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

  generateId() {
    return crypto.randomUUID();
  }

  validateInput({ title, priority, dueDate }) {
    //console.log(`Form data is: ${formData}`);
    console.log("Validating...");
    return {
      title: this.validateTitle(title),
      priority: this.validatePriority(priority),
      dueDate: this.validateDueDate(dueDate),
    };
  }

  validateTitle(title) {
    // if title doesn't exist or is blank
    if (!title || title.trim() === "") {
      throw Error("Title field is required.");
    }
    return true;
  }

  validatePriority(priority) {
    console.log("validating priority");
    const allowed = ["Low", "Medium", "High", "Unprioritized"];
    // throws error
    if (!allowed.includes(priority)) throw Error("Invalid priority");
    // if valid
    return true;
  }

  validateDueDate(dueDate) {
    if (!dueDate) return true;
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      throw Error("Invalid due date.");
    }
    return true;
  }
}
