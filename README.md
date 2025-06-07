# To-do list app

This project is part of The Odin Project's Full Stack JavaScript course. You can [read more about this project here](https://www.theodinproject.com/lessons/node-path-javascript-todo-list).

## Planning

Usually when starting a project, I am so excited to begin that I just dive right into it. This time I'm taking a more planning-heavy approach and I thought it might be interesting to document what I've tried, what worked, what didn't, etc.

To begin with, I created a list of functionality to define the project's scope.

### Project Scoping

#### To-do lists

- Each user starts with a default to-do list.
- A list has a name and a description.
- A list contains to-do items.
- Users can create, delete, and edit lists.
- Deleting a list deletes all to-do items inside it.

#### To-do items

- A to-do item has a title, description, due date, and priority.
- A to-do item has a completion status (complete / incomplete).
- Users can create, edit, and delete to-do items.
- Users can change a to-do item's priority.
- Users can move a to-do item to a different project.

#### Optional enhancements

- A to-do item can optionally contain sub-items.
- A sub-item has a title and description.
- A sub-item has a completion status (complete / incomplete).
- Users can create, edit, and delete sub-items.
- When all sub-items are complete, the parent item can be marked as complete.
- When a to-do list item is deleted, its sub-items are also deleted.

## Planning

Even with all of this mapped out, I still felt a little overwhelmed about beginning. I tried starting to write some pseudocode, but I kept getting stuck because of three things.

1. Thinking about the code's functionality felt a little overwhelming without having access to the UI first.
2. I was struggling to envision the correct separation of logic to meet SOLID principles (which I don't expect to fully meet but I want to make my best attempt.)
3. The full functionality of the app is pretty expansive and it felt a little overwhelming deciding where to begin.

To solve #1, I did two things: I created some very lo-fi sketches of the UI I had in mind, and I started straightaway building the UI with HTML and CSS (which I intentionally kept very simple so as not to spend too much time focused on perfecting it.) I felt like once I had this in place, I would feel more prepared to begin coding.

To solve #2, I did some research into design patterns and I learned about MVC (Model-View-Controller) which I decided that I wanted to use for structuring the logic of my app.

To solve #3, I decided to begin by only implementing a few features and then moving on from there. So to start, I focused on the workflow of using the UI to successfully create, read, update, and delete tasks.

### Mapping the user workflow

To facilitate my planning of the MVC architecture, I wanted to write out the 'happy path' user flow for each action and map that action to a part of the code - the model, view, or controller.

I don't expect these to be perfect - but they at least give me something to start with.

#### Creating a to-do item

- The user clicks "+ Add New Item" button.
  - The View creates a modal with form fields and buttons for the user to fill in about their to-do item.
- The user clicks a confirmation button to save their to-do item.
  - The View listens for the button click and passes this data to the controller.
  - The Controller sanitizes the input and passes it to the Model.
  - The Model stores the todo-item in an object that holds all of the todo-items.
  - If successful, the Controller passes the directive for View to close the modal.
- The user can sees their first to-do rendered on the page.
  - The View gets the to-do list object from the Model and renders it to the page.

#### Updating a to-do item

- The user clicks the "Edit" button on their to-do item.
  - The View creates a modal with form fields and buttons for the user to edit about their to-do item. The form fields should contain the existing data for that item, which the Controller sends to the View (from the Model).
- The user clicks a confirmation button to updates their to-do item.
  - The View listens for the button click and passes this data to the controller. Then, it closes the modal.
  - The Controller sanitizes the input and passes it to the Model.
  - The Model updates the todo-item in an object that holds all of the todo-items.
- The user can sees their first to-do rendered on the page.
  - The View gets the updated to-do list item from the Controller (who gets it from the Model) and renders it to the page.

#### Deleting a todo item

- The user clicks the "X" button on their todo-item.
  - View renders a confirmation modal asking the user if they are sure they want to delete.
- The user clicks confirm.
  - View closes the modal.
  - The View triggers the deletion request and passes it to the Controller. The Controller handles the confirmation response and, if confirmed, updates the Model, which then deletes the to-do item from the to-do object.
  - The View gets the updated to-do list object from the Model and renders it to the page.

## Planning

For my next step, I started building out `model.js`, `view.js` and `controller.js` which ended up being a lot more complicated than I anticipated (and I was already expecting it to be complicated). Because I wanted to hook up my event listeners right away to the main action buttons on my UI, I had to learn about defining DOM elements in the main entry point (in my case that's `index.js`) and passing them in to View. I also learned (but don't yet fully comprehend) how you need to do a bunch of strange binding stuff to get the View to be able to communicate nicely with the Controller.
