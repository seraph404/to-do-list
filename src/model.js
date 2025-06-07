export class Model {
  constructor() {
    // some dummy data for testing purposes
    this.todos = [
      {
        dueDate: "06-07-25",
        id: "01a76d3c-223d-4320-ab05-a00f359e2148",
        priority: "High",
        title: "Go to the library",
      },
      {
        dueDate: "06-12-25",
        id: "01a76d3c-223d-4320-ab05-a00f359e2149",
        priority: "Medium",
        title: "Clean out the fridge",
      },
    ];
  }

  addTodo({ title, dueDate, priority, status }) {
    const id = crypto.randomUUID();
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

  deleteTodo({ id, title, dueDate, priority }) {
    console.log("Proceed with deletion.");
  }

  get todoItems() {
    return this.todos;
  }
}

export class TodoItem {
  constructor({ id, title, dueDate, priority, status }) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }
}
