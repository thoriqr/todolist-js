const todos = [
  {
    todo: "Example todo 1",
    complete: false,
  },
  {
    todo: "Example todo 2",
    complete: false,
  },
  {
    todo: "Example todo 3",
    complete: false,
  },
];

const completedTodos = [];

let timeoutId; // Variable to store the timeout reference

// Clear first child todolist element after add todo
const clearTodoList = () => {
  const todoList = document.getElementById("todoList");
  // checking first child todolist element
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
};

const clearCompletedTodoList = () => {
  const completedTodoList = document.getElementById("completedTodoList");
  while (completedTodoList.firstChild) {
    completedTodoList.removeChild(completedTodoList.firstChild);
  }
};

// remove todo list
const removeTodoList = (index) => {
  todos.splice(index, 1);
  displayTodoList();
};

const updateTodo = (index, updatedTodo) => {
  todos[index].todo = updatedTodo;
  displayTodoList(); // Refresh the todo list on the UI
};

const completeTodoList = (index) => {
  const completedTodo = todos[index];
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString("id-ID");
  completedTodo.date = formattedDate;
  completedTodos.push(completedTodo);
  todos.splice(index, 1);
  displayCompletedTodoList();
  displayTodoList();

  const clearAllButton = document.getElementById("clearAllButton");
  clearAllButton.onclick = () => {
    completedTodos.length = 0; // Clear the completedTodos array
    displayCompletedTodoList();

    // Hide the Clear All button
    clearAllButton.classList.add("hidden");
  };

  // Check if completedTodos is not empty, show Clear All button; otherwise, hide it
  if (completedTodos.length > 0) {
    clearAllButton.classList.remove("hidden");
  } else {
    clearAllButton.classList.add("hidden");
  }
};

// Create element todo
const createTodo = (index, todo) => {
  const todoList = document.getElementById("todoList"); // get ul tag

  const li = document.createElement("li"); // create li tag  todo value
  li.textContent = todo.todo;
  todoList.appendChild(li);

  const completeTodo = document.createElement("button");
  completeTodo.classList.add("fas", "fa-check-square");
  completeTodo.setAttribute("title", "Complete");
  completeTodo.onclick = () => {
    completeTodoList(index);
  };
  li.appendChild(completeTodo);

  const editTodo = document.createElement("button"); // create button tag edit todo
  editTodo.classList.add("fas", "fa-pencil");
  editTodo.setAttribute("title", "Edit");
  editTodo.onclick = () => {
    const existingInput = document.getElementById("editInput");
    if (existingInput) {
      alert("Please complete the previous edit before editing again.");
      return;
    }

    li.style.border = "none";
    const input = document.createElement("input"); // create input element
    input.id = "editInput";
    input.setAttribute("autocomplete", "off");
    input.value = li.textContent;
    const editDone = document.createElement("button");
    editDone.classList.add("fas", "fa-floppy-disk");
    editDone.setAttribute("title", "Save");

    editDone.onclick = () => {
      const updateTodoAlert = document.getElementById("alert");
      const updatedTodo = input.value.trim();

      if (updatedTodo !== "") {
        updateTodoAlert.innerHTML = "Todo updated";
        updateTodoAlert.style.display = "block";

        updateTodo(index, updatedTodo);
        li.innerHTML = updatedTodo;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateTodoAlert.style.display = "none";
        }, 2500);
      }
    };

    input.onkeydown = (event) => {
      if (event.key === "Enter") {
        const updateTodoAlert = document.getElementById("alert");
        const updatedTodo = input.value.trim();

        if (updatedTodo !== "") {
          updateTodoAlert.innerHTML = "Todo updated";
          updateTodoAlert.style.display = "block";

          updateTodo(index, updatedTodo);
          li.innerHTML = updatedTodo;

          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            updateTodoAlert.style.display = "none";
          }, 2500);
        }
      }
    };

    const editCancel = document.createElement("button");
    editCancel.classList.add("fas", "fa-x");
    editCancel.setAttribute("title", "Cancel");

    editCancel.onclick = () => {
      displayTodoList();
    };

    li.textContent = ""; // clear the li content
    li.appendChild(input);
    li.appendChild(editDone);
    li.appendChild(editCancel);
  };

  li.appendChild(editTodo);

  const deleteTodo = document.createElement("button"); // create button tag  delete todo
  deleteTodo.classList.add("fas", "fa-trash");
  deleteTodo.setAttribute("title", "Delete");
  deleteTodo.onclick = () => {
    removeTodoList(index);
    const deletedTodoAlert = document.getElementById("alert");
    deletedTodoAlert.style.display = "block";
    deletedTodoAlert.innerHTML = "Todo deleted!";
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      deletedTodoAlert.style.display = "none";
    }, 2500);
  };
  li.appendChild(deleteTodo);
};

// Displaying Todo list
const displayTodoList = () => {
  clearTodoList();

  const todoList = document.getElementById("todoList");
  let todosFound = false; // Variable to track if any todos were found

  if (todos.length === 0) {
    const noTodoElement = document.createElement("li");
    noTodoElement.textContent = "No todos in here.";
    todoList.appendChild(noTodoElement);
    return;
  }

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i].todo; // Access the 'todo' property
    const searchText = document
      .getElementById("searchInput")
      .value.toLowerCase();
    // checking if todo include value in searchText ? showing list of todo
    if (todo.toLowerCase().includes(searchText)) {
      createTodo(i, todos[i]); // Pass the entire object to createTodo
      todosFound = true; // Set the flag to true since todos were found
    }
  }

  // Check if any todos were found
  if (!todosFound) {
    const todoList = document.getElementById("todoList");
    const noTodosElement = document.createElement("li");
    noTodosElement.textContent = "Todo not found";
    todoList.appendChild(noTodosElement);
  }
};

// Displaying Completed Todo List
const displayCompletedTodoList = () => {
  clearCompletedTodoList();

  const completedTodoList = document.getElementById("completedTodoList");

  if (completedTodos.length === 0) {
    const noCompletedTodoElement = document.createElement("li");
    noCompletedTodoElement.textContent = "No completed todos.";
    completedTodoList.appendChild(noCompletedTodoElement);
    return;
  }

  for (let i = 0; i < completedTodos.length; i++) {
    const completedTodo = completedTodos[i].todo;
    const dateOfCompletedTodo = completedTodos[i].date;

    const completedTodoList = document.getElementById("completedTodoList");

    const li = document.createElement("li");
    li.textContent = completedTodo;

    const span = document.createElement("span");
    span.classList.add("dateCompleted");
    span.textContent = dateOfCompletedTodo;
    li.appendChild(span);

    completedTodoList.appendChild(li);
  }
};

// Execution todo
document.forms.namedItem("addForm").onsubmit = (event) => {
  event.preventDefault();

  const newTodoAlert = document.getElementById("alert");
  newTodoAlert.innerHTML = "Add new Todo!";
  const warningInput = document.getElementById("warningInput");
  warningInput.innerHTML = "Please type something!";

  const todoText = document.getElementById("addInput").value;
  if (todoText.trim().length >= 1) {
    const newTodo = {
      todo: todoText,
      complete: false,
    };
    todos.push(newTodo);
    displayTodoList();

    newTodoAlert.style.display = "block";
    warningInput.style.display = "none";

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      newTodoAlert.style.display = "none";
    }, 2500);
  } else {
    warningInput.style.display = "block";
    newTodoAlert.style.display = "none";
  }

  document.forms.namedItem("addForm").reset();
  console.log(todos);
};

displayTodoList();
displayCompletedTodoList();

const filterTodo = document.getElementById("searchInput");
// every press key it showing todo list
filterTodo.onkeyup = () => {
  displayTodoList();
};
filterTodo.onkeydown = () => {
  displayTodoList();
};

// const removeAllTodo = () => {
//   const clearAllButton = document.createElement("button");
//   clearAllButton.textContent = "Clear All";
//   clearAllButton.classList.add("clearAllButton")

//   const completedTodoTitle = document.querySelector(".completedTodoTitle")
//   completedTodoTitle.insertAdjacentElement("afterend", clearAllButton)

// }
// removeAllTodo()
