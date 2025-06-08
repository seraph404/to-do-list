export class Model {
  constructor() {
    // some dummy data for testing purposes
    this.todos = [
      {
        dueDate: "06-07-25",
        id: "01a76d3c-223d-4320-ab05-a00f359e2148",
        priority: "High",
        title: "Go to the library",
        status: "Incomplete",
      },
      {
        dueDate: "06-12-25",
        id: "01a76d3c-223d-4320-ab05-a00f359e2149",
        priority: "Medium",
        title: "Clean out the fridge",
        status: "Complete",
      },
    ];
  }

  addTodo({ id, title, dueDate, priority, status }) {
    this.status = "Incomplete";
    const newTodo = new TodoItem({
      id: id,
      title: title,
      dueDate: dueDate,
      priority: priority,
      status: status,
    });
    this.todos.push(newTodo);
    console.log(this.todos);
  }

  editTodo({ id, title, dueDate, priority }) {
    console.log("Proceed with editing.");
  }

  deleteTodo({ id }) {
    console.log(
      "Before deletion:",
      this.todos.map((todo) => todo.id)
    );
    console.log("Deleting todo with ID:", id);

    this.todos = this.todos.filter((todo) => {
      const todoId = String(todo.id).trim();
      const targetId = String(id).trim();
      const keep = todoId !== targetId;
      console.log(`Compare: ${todoId} !== ${targetId} → ${keep}`);
      return keep;
    });

    console.log(
      "After deletion:",
      this.todos.map((todo) => todo.id)
    );
  }

  get todoItems() {
    return this.todos;
  }

  set todoStatus({ id, status }) {
    const todo = this.getTodoFromId(id);
    console.log("Looking for status...");
    if (todo) {
      todo.status = status;
      console.log(`Todo ${id} status updated to ${status}`);
    } else {
      console.warn(`Todo with ID ${id} not found.`);
    }
  }

  getTodoFromId(id) {
    console.log("Searching for match...");

    const match = this.todoItems.find((element) => {
      //console.log("match", element.id);
      return element.id === id;
    });

    if (match) {
      //console.log("Match found!");
      //console.log("Status:", match.status);
    } else {
      //console.log("No match found for ID:", id);
    }

    return match;
  }
}

export class TodoItem {
  constructor({ id, title, dueDate, priority, status = "Incomplete" }) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }
}
