import { View } from "./view.js";
import { Model } from "./model.js";

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.currentEditingId = null;

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

  onAdd({ title, dueDate, priority }) {
    try {
      this.validateInput({ title, dueDate, priority });
    } catch (error) {
      // TODO: Make this.view.showValidationError for user-facing errors
      console.error("Validation failed!", error);
    }

    const result = this.model.addTodo({
      title,
      dueDate,
      priority,
    });

    if (result.success) {
      this.view.resetForm();
      this.view.closeModal();
      this.view.appendNewTodo(result.todo);
    }
  }

  onEditStart(id) {
    const todo = this.model.getTodoFromId(id);
    if (!todo) {
      console.warn(`No todo found for ID: ${id}`);
      return;
    }
    this.currentEditingId = id;
    this.view.showModal("edit");
    this.view.populateEditForm(todo);
  }

  onEditSubmit({ title, dueDate, priority }) {
    this.validateInput({ title, dueDate, priority });
    const id = this.currentEditingId;
    const todo = { id, title, dueDate, priority };
    this.model.editTodo({ id, title, dueDate, priority });
    this.view.replaceTodo(todo);
    this.view.closeModal();
  }

  onDelete({ id }) {
    if (this.todoExists(id)) {
      this.model.deleteTodo({ id });
    }
    this.view.removeTodo(id);
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
