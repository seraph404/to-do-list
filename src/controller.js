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
    this.view.bindOnEditStart(this.onEditStart.bind(this));
    this.view.bindOnEditSubmit(this.onEditSubmit.bind(this));
    this.view.bindOnDelete(this.onDelete.bind(this));
    this.view.bindOnCheck(this.onCheck.bind(this));
  }

  onAdd({ id, title, dueDate, priority }) {
    try {
      // generate a unique ID for this item
      id = this.generateId();
      // ensure the input is valid
      this.validateInput({ id, title, dueDate, priority });
      // tell model to add to todo object
      this.model.addTodo({
        id,
        title,
        dueDate,
        priority,
        status: "Incomplete",
      });
      const todo = { id, title, dueDate, priority };
      // return success value, plus the individual todo
      return { success: true, todo };
    } catch (error) {
      console.error("Validation failed!", error);
    }
  }

  onEditStart({ id }) {
    const todo = this.model.getTodoFromId(id);
    if (!todo) {
      console.warn(`No todo found for ID: ${id}`);
      return;
    }
    this.view.populateEditForm(todo);
    // check if to-do item exists
    //if (this.todoExists(id)) {
    //console.log("To-do exists! Proceed with editing.");
    // send directive to model
    //this.model.editTodo({ id, title, dueDate, priority });
    //}
  }

  onEditSubmit({ title, dueDate, priority }, id) {
    console.log(`ID being edited: ${id}`);
    this.validateInput({ title, dueDate, priority });
    this.model.editTodo({ id, title, dueDate, priority });
    this.view.displayNewTodo({ id, title, dueDate, priority });
    this.view.removeTodo(id);
  }

  onDelete({ id }) {
    console.log("onDelete, Controller.js");
    this.model.deleteTodo({ id });
  }

  onCheck(id) {
    const todo = this.model.getTodoFromId(id);
    if (!todo) {
      console.warn(`No todo found for ID: ${id}`);
      return;
    }

    const newStatus = todo.status === "Complete" ? "Incomplete" : "Complete";
    this.model.todoStatus = { id, status: newStatus };
  }

  todoExists(id) {
    return this.model.todoItems.some((todo) => todo.id === id);
  }

  generateId() {
    return crypto.randomUUID();
  }

  validateInput({ title, priority, dueDate }) {
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
    const allowed = ["Low", "Medium", "High", "Unprioritized"];
    if (!allowed.includes(priority)) {
      throw Error("Invalid priority");
    }
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

  initializeApp() {
    const todos = this.model.todoItems;
    this.view.displayExistingTodos(todos);
  }
}
