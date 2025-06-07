import { Controller } from "./controller.js";

export class View {
  constructor({ openModalBtn, todoItems, createTodoBtn, cancelTodoBtn }) {
    this.openModalBtn = openModalBtn;
    this.todoItems = todoItems;
    this.createTodoBtn = createTodoBtn;
    this.cancelTodoBtn = cancelTodoBtn;
    this.modal = document.querySelector(".modal");
    this.form = this.modal.querySelector("#todo-form");
    this.handleClick = this.handleClick.bind(this);

    /* event listeners */
    this.openModalBtn.addEventListener("click", this.handleClick);
    this.todoItems.addEventListener("click", this.handleClick);
    this.createTodoBtn.addEventListener("click", this.handleClick);
    this.cancelTodoBtn.addEventListener("click", this.handleClick);
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

    if (action === "open-modal") {
      this.showModal();
      //this.onAdd();
    } else if (action === "edit") {
      this.onEdit();
    } else if (action === "delete") {
      this.onDelete();
    } else if (action === "create-todo") {
      // get values from todo form
      event.preventDefault();
      const values = this.getFormValues();
      this.onAdd(values);
      //this.resetForm();
      //this.closeModal();
    } else if (action === "cancel-todo") {
      this.closeModal();
    }
  }

  showModal() {
    this.modal.show();
  }

  closeModal() {
    this.resetForm();
    this.modal.close();
  }

  resetForm() {
    this.form.reset();
  }

  getFormValues() {
    const formData = new FormData(this.form);
    return {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      dueDate: formData.get("due-date"),
    };
  }

  displayNewTodo({ id, title, description, priority, dueDate }) {
    console.log("Displaying new todo...");

    // elements
    const todoItemContainer = document.createElement("div");
    const todoDetails = document.createElement("details");
    const todoHeader = document.createElement("summary");
    const todoTitle = document.createElement("span");
    const todoMeta = document.createElement("div");
    const todoPriority = document.createElement("span");
    const todoDate = document.createElement("span");
    const todoDescription = document.createElement("div");
    const todoActions = document.createElement("div");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    // classes
    todoItemContainer.classList.add("todo-item-container");
    todoDetails.classList.add("todo-details");
    todoHeader.classList.add("todo-header");
    todoTitle.classList.add("todo-title");
    todoMeta.classList.add("todo-meta");
    todoPriority.classList.add("todo-priority");
    if (priority) {
      todoPriority.classList.add(priority.toLowerCase());
      todoPriority.textContent = priority;
    }
    todoDate.classList.add("todo-date");
    if (dueDate) {
      todoDate.textContent = `Due: ${dueDate}`;
    }
    todoDescription.classList.add("todo-description");
    todoActions.classList.add("todo-actions");

    // text
    todoTitle.textContent = title;
    if (description) {
      todoDescription.textContent = description;
    }

    // buttons
    editBtn.classList.add("action-btn");
    editBtn.setAttribute("data-action", "edit");
    editBtn.textContent = "Edit";

    deleteBtn.classList.add("action-btn");
    deleteBtn.setAttribute("data-action", "delete");
    deleteBtn.textContent = "Delete";

    // appends
    todoMeta.append(todoPriority, todoDate);
    todoHeader.append(todoTitle, todoMeta);
    todoDetails.append(todoHeader);
    if (description) todoDetails.append(todoDescription);
    todoActions.append(editBtn, deleteBtn);

    todoItemContainer.append(todoDetails, todoActions);
    this.todoItems.append(todoItemContainer);
  }
} // class end
