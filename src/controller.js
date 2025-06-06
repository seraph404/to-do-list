import { View } from "./view.js";

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

  onAdd() {
    console.log("Adding!");
  }

  onEdit() {
    console.log("Editing!");
  }

  onDelete() {
    console.log("Deleting!");
  }
}
