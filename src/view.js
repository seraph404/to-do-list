import { Controller } from "./controller.js";

export class View {
  constructor({ openModalBtn, todoItems, todoForm }) {
    this.openModalBtn = openModalBtn;
    this.todoItems = todoItems;
    this.todoForm = todoForm;
    this.modal = document.querySelector(".modal");
    this.form = document.querySelector("#todo-form");
    this.handleClick = this.handleClick.bind(this);

    /* event listeners */
    this.openModalBtn.addEventListener("click", this.handleClick);
    this.todoItems.addEventListener("click", this.handleClick);
    this.todoForm.addEventListener("click", this.handleClick);
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

  bindOnCheck(handler) {
    this.onCheck = handler;
  }

  handleClick(event) {
    const target = event.target;
    const action = target.dataset.action;
    const container = target.closest(".todo-item-container");

    if (action === "open-modal") {
      this.showModal();
    } else if (action === "edit") {
      this.onEdit({ id: container.dataset.id });
      // then, show modal
      this.showModal("edit");
    } else if (action === "delete") {
      console.log("View.js delete!");
      this.onDelete({ id: container.dataset.id });
      // remove from DOM
      // but maybe check somehow that onDelete is successful before running it
      container.remove();
    } else if (action === "create-todo") {
      // get values from todo form
      event.preventDefault();
      const values = this.getFormValues();
      this.onAdd(values);
      //this.resetForm();
      //this.closeModal();
      // when the user is done editing and wants to submit
    } else if (action === "edit-todo") {
      event.preventDefault();
      // put edit logic here
    } else if (action === "cancel-todo") {
      this.closeModal();
    } else if (action === "toggle-complete") {
      const container = target.closest(".todo-item-container");
      this.onCheck(container.dataset.id);
      this.toggleStrikethrough(target, container);
    }
  }

  showModal(mode, todo) {
    console.log(mode);
    if (mode === "edit") {
      console.log(this.form);
      const h2 = this.form.querySelector("h2");
      const button = this.form.querySelector(
        ".modal-buttons > [data-action='create-todo']"
      );
      button.value = "Edit to-do";
      button.dataset.action = "edit-todo";
      h2.textContent = "Edit To-Do";
    }
    this.modal.show();
  }

  closeModal() {
    this.resetForm();
    this.modal.close();
  }

  // populate "edit" form with existing content
  populateEditForm(todo) {
    const { title, priority, dueDate, id } = todo;
    this.form.querySelector("[name='title']").value = title || "";
    this.form.querySelector("[name='priority'").value = priority || "";
    this.form.querySelector("[name='due-date'").value = dueDate || "";
  }

  resetForm() {
    this.form.reset();
  }

  getFormValues() {
    const formData = new FormData(this.form);
    return {
      title: formData.get("title"),
      priority: formData.get("priority"),
      dueDate: formData.get("due-date"),
    };
  }

  displayNewTodo({ id, title, priority, dueDate }) {
    console.log("Displaying new todo...");

    // elements
    const todoItemContainer = document.createElement("div");
    const todoDetails = document.createElement("div");
    const todoHeader = document.createElement("div");
    const todoTitle = document.createElement("span");
    const todoMeta = document.createElement("div");
    const todoPriority = document.createElement("span");
    const todoDate = document.createElement("span");
    const todoActions = document.createElement("div");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.dataset.action = "toggle-complete";
    // associate each item with a unique ID
    todoItemContainer.dataset.id = id;

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
    todoActions.classList.add("todo-actions");
    checkbox.classList.add("todo-checkbox");

    // text
    todoTitle.textContent = title;

    // buttons
    editBtn.classList.add("action-btn");
    editBtn.setAttribute("data-action", "edit");
    editBtn.textContent = "Edit";

    deleteBtn.classList.add("action-btn");
    deleteBtn.setAttribute("data-action", "delete");
    deleteBtn.textContent = "Delete";

    // appends
    todoItemContainer.append(checkbox);
    todoMeta.append(todoPriority, todoDate);
    todoHeader.append(todoTitle, todoMeta);
    todoDetails.append(todoHeader);
    todoActions.append(editBtn, deleteBtn);

    todoItemContainer.append(todoDetails, todoActions);
    this.todoItems.append(todoItemContainer);
  }

  toggleStrikethrough(target, container) {
    const title = container.querySelector(".todo-title");

    if (title.style.textDecoration === "line-through") {
      title.style.textDecoration = "none";
    } else {
      title.style.textDecoration = "line-through";
    }
  }
} // class end
