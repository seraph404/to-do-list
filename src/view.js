import { Controller } from "./controller.js";

export class View {
  // the constructor arguments are items being passed in from index.js
  constructor({ openModalBtn, todoItems, todoForm }) {
    this.openModalBtn = openModalBtn;
    this.todoItems = todoItems;
    this.todoForm = todoForm;
    // these are "global" variables needed by the entire module
    this.modal = document.querySelector(".modal");
    this.form = document.querySelector("#todo-form");
    this.handleClick = this.handleClick.bind(this);

    // these are event listeners
    this.openModalBtn.addEventListener("click", this.handleClick);
    this.todoItems.addEventListener("click", this.handleClick);
    this.todoForm.addEventListener("click", this.handleClick);
  }

  // ========== Event Binding ========== //

  bindOnAdd(handler) {
    this.onAdd = handler;
  }

  bindOnEditStart(handler) {
    this.onEditStart = handler;
  }

  bindOnEditSubmit(handler) {
    this.onEditSubmit = handler;
  }

  bindOnDelete(handler) {
    this.onDelete = handler;
  }

  bindOnCheck(handler) {
    this.onCheck = handler;
  }

  // ========== Event Handlers ========== //

  handleClick(event) {
    const target = event.target;
    const action = target.dataset.action;
    const container = target.closest(".todo-item-container");

    switch (action) {
      case "open-create-todo":
        this.onOpenCreateModal();
        break;
      case "submit-create-todo":
        this.onCreateSubmit(event);
        break;
      case "open-edit-todo":
        this.onOpenEditModal(container);
        break;
      case "submit-edit-todo":
        this.onEdit(event);
        break;
      case "delete-todo":
        this.onDeleteTodo(container);
        break;
      case "dismiss-todo-modal":
        this.onCancelModal();
        break;
      case "toggle-complete":
        this.onToggleComplete(container);
        break;
    }
  }

  onOpenCreateModal() {
    this.showModal();
  }

  onCreateSubmit(event) {
    event.preventDefault();
    const values = this.getFormValues();
    this.onAdd(values);
  }

  onOpenEditModal(container) {
    const id = container.dataset.id;
    this.onEditStart(id);
  }

  onEdit(event) {
    event.preventDefault();
    const values = this.getFormValues();
    this.onEditSubmit(values);
  }

  onDeleteTodo(container) {
    this.onDelete({ id: container.dataset.id });
  }

  onCancelModal() {
    this.closeModal();
  }

  onToggleComplete(container) {
    // changes the todo status
    this.onCheck(container.dataset.id);
    // applies the styling
    //this.toggleStrikethrough({ target, container });
  }

  // ========== Modal Controls ========== //

  showModal(mode) {
    console.log(mode);
    if (mode === "edit") {
      this.configureEditModal();
    } else {
      this.configureCreateModal();
    }
    this.modal.show();
  }

  closeModal() {
    this.resetForm();
    this.modal.close();
  }
  // should only run once the modal appears
  configureEditModal() {
    const h2 = this.form.querySelector("h2");
    const button = this.form.querySelector("#submit-modal");
    button.value = "Edit to-do";
    button.dataset.action = "submit-edit-todo";
    h2.textContent = "Edit To-Do";
  }

  configureCreateModal() {
    const h2 = this.form.querySelector("h2");
    const button = this.form.querySelector("#submit-modal");
    button.value = "Create to-do";
    button.dataset.action = "submit-create-todo";
    h2.textContent = "Create To-Do";
  }

  // ========== Form Handling ========== //

  // populate "edit" form with existing content
  populateEditForm(todo) {
    const { title, priority, dueDate, id } = todo;
    console.log("populateEditForm", dueDate);
    this.form.querySelector("[name='title']").value = title || "";
    this.form.querySelector("[name='priority']").value = priority || "";
    this.form.querySelector("[name='due-date']").value = dueDate || "";
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

  // ========== Todo Rendering ========== //

  // creates all of the DOM stuff needed for an item
  displayNewTodo({ id, title, priority, dueDate, status }) {
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

    // completion rendering rules
    if (status === "Complete") {
      todoTitle.style.textDecoration = "line-through";
      checkbox.checked = true;
    }

    // text
    todoTitle.textContent = title;

    // buttons
    editBtn.classList.add("action-btn");
    editBtn.setAttribute("data-action", "open-edit-todo");
    editBtn.textContent = "Edit";

    deleteBtn.classList.add("action-btn");
    deleteBtn.setAttribute("data-action", "delete-todo");
    deleteBtn.textContent = "Delete";

    // appends
    todoItemContainer.append(checkbox);
    todoMeta.append(todoPriority, todoDate);
    todoHeader.append(todoTitle, todoMeta);
    todoDetails.append(todoHeader);
    todoActions.append(editBtn, deleteBtn);
    todoItemContainer.append(todoDetails, todoActions);

    return todoItemContainer;
  }

  // appends to the end of the list
  appendNewTodo({ id, title, priority, dueDate, status }) {
    this.todoItems.append(
      this.displayNewTodo({ id, title, priority, dueDate, status })
    );
  }

  replaceTodo({ id, title, priority, dueDate, status }) {
    //console.log("Replacing todo");
    const oldNode = this.todoItems.querySelector(`[data-id="${id}"]`);
    if (oldNode) {
      const newNode = this.displayNewTodo({
        id,
        title,
        priority,
        dueDate,
        status,
      });
      this.todoItems.replaceChild(newNode, oldNode);
    }
    //console.log("replaceTodo status is...", status);
  }

  toggleStrikethrough({ id, newStatus }) {
    console.log("Toggling strikethrough...");
    const todo = this.todoItems.querySelector(`[data-id="${id}"]`);
    const title = todo.querySelector(".todo-title");

    if (newStatus === "Complete") {
      title.style.textDecoration = "line-through";
    } else if (newStatus === "Incomplete") {
      title.style.textDecoration = "none";
    }
  }

  removeTodo(id) {
    const toRemove = document.querySelector(`[data-id='${id}']`);
    toRemove.remove();
  }

  displayExistingTodos(todos) {
    console.log("Displaying todos...");
    todos.forEach((todo) => {
      this.appendNewTodo({
        id: todo.id,
        title: todo.title,
        priority: todo.priority,
        dueDate: todo.dueDate,
        status: todo.status,
      });
    });
  }
} // class end
