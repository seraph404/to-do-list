export class Model {
  constructor() {
    // some dummy data for testing purposes
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
    } else {
      this.todos = [
        {
          dueDate: "2025-07-25",
          id: "01a76d3c-223d-4320-ab05-a00f359e2148",
          priority: "High",
          title: "Go to the library",
          status: "Complete",
        },
        {
          dueDate: "2025-07-20",
          id: "01a76d3c-223d-4320-ab05-a00f359e2141",
          priority: "Low",
          title: "Take out the trash",
          status: "Complete",
        },
        {
          dueDate: "2025-06-14",
          id: "01a76d3c-223d-4320-ab05-a00f359e2149",
          priority: "Medium",
          title: "Clean out the fridge",
          status: "Incomplete",
        },
      ];
    }
  }

  addTodo({ title, dueDate, priority }) {
    const todoItem = new TodoItem({
      title: title,
      dueDate: dueDate,
      priority: priority,
    });
    this.todos.push(todoItem);
    this.saveTodos();
    return { success: true, todo: todoItem };
  }

  editTodo({ id, title, dueDate, priority, status }) {
    const todoItem = this.getTodoFromId(id);
    console.log("Before edit:", todoItem);
    // check if field needs to be changed, then change it
    if (todoItem.title !== title) {
      todoItem.title = title;
    }

    if (todoItem.dueDate !== dueDate) {
      todoItem.dueDate = dueDate;
    }

    if (todoItem.priority !== priority) {
      todoItem.priority = priority;
    }

    if (todoItem.status !== status) {
      todoItem.status = status;
    }
    console.log("After edit:", todoItem);
    this.saveTodos();
    return { success: true, todo: todoItem };
  }

  deleteTodo({ id }) {
    this.todos = this.todos.filter((todo) => {
      const todoId = String(todo.id).trim();
      const targetId = String(id).trim();
      const keep = todoId !== targetId;
      console.log(`Compare: ${todoId} !== ${targetId} → ${keep}`);
      return keep;
    });
    this.saveTodos();
  }

  get todoItems() {
    return this.todos;
  }

  set todoStatus({ id, status }) {
    const todo = this.getTodoFromId(id);
    if (todo) {
      const oldStatus = todo.status;
      todo.status = status;
      console.log(`Todo status changed from ${oldStatus} to ${status}`);
      this.saveTodos();
    } else {
      console.warn(`Todo with ID ${id} not found.`);
    }
  }

  getTodoStatus({ id }) {
    const todo = this.getTodoFromId(id);
    return todo.status;
  }

  getTodoFromId(id) {
    //console.log("Searching for match...");

    const match = this.todoItems.find((element) => {
      //console.log("match", element.id);
      return element.id === id;
    });

    return match;
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }
}

export class TodoItem {
  constructor({
    id = crypto.randomUUID(),
    title,
    dueDate,
    priority,
    status = "Incomplete",
  }) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }
}
