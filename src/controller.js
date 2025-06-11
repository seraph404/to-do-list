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
      console.error("Validation failed!", error);
      return;
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
    const status = this.model.getTodoStatus({ id });
    console.log("onEditStart", status);
    console.log("onEditStart", todo);
    this.view.populateEditForm(todo);
  }

  onEditSubmit({ title, dueDate, priority }) {
    console.log("onEditSubmit", dueDate);
    try {
      this.validateInput({ title, dueDate, priority });
    } catch (error) {
      console.error("Validation failed!", error);
      return;
    }
    const id = this.currentEditingId;
    const status = this.model.getTodoStatus({ id });
    const result = this.model.editTodo({
      id,
      title,
      dueDate,
      priority,
      status,
    });
    if (result.success) {
      this.view.replaceTodo({
        id,
        title,
        priority,
        dueDate,
        status,
      });
      this.view.closeModal();
    }
  }

  onDelete({ id }) {
    if (
      confirm(
        "Are you sure you want to permanently delete this item? This action cannot be undone."
      )
    ) {
      if (this.todoExists(id)) {
        this.model.deleteTodo({ id });
      }
      this.view.removeTodo(id);
    }
  }

  onCheck(id) {
    console.log("check");
    const currentStatus = this.model.getTodoStatus({ id });
    if (currentStatus === "Complete") {
      const newStatus = "Incomplete";
      this.model.todoStatus = { id, status: newStatus };
      this.view.toggleStrikethrough({ id, newStatus });
    } else if (currentStatus === "Incomplete") {
      const newStatus = "Complete";
      this.model.todoStatus = { id, status: newStatus };
      this.view.toggleStrikethrough({ id, newStatus });
    }
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
      const error = "This field is required.";
      this.view.showValidationError("title", error);
      throw Error("Title field is required.");
    }
    return true;
  }

  validatePriority(priority) {
    const allowed = ["Low", "Medium", "High", "Unprioritized"];
    if (!allowed.includes(priority)) {
      const error = "Invalid priority.";
      this.view.showValidationError("priority", error);
      throw Error("Invalid priority");
    }
    return true;
  }

  validateDueDate(dueDate) {
    if (!dueDate) return true;

    const date = new Date(dueDate);
    const currentDate = new Date();
    if (date < currentDate) {
      const error = "Due date must be set in the future.";
      this.view.showValidationError("dueDate", error);
      throw Error("Due date must be set in the future.");
    }

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
