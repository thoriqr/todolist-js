import {
  getAllTodo,
  addNewTodo,
  deleteTodo,
  deleteCompletedTodo,
  completeTodo,
  getTodoById,
  updateTodo,
} from "./fetchTodos.js";

async function displayTodos() {
  let todosFound = false; // Variable to track if any todos were found

  try {
    const todos = await getAllTodo();
    updateCompletedTodo(todos);

    const cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = "";

    const searchText = document
      .getElementById("search-input")
      .value.toLowerCase();
    const activeTodos = todos.filter((todo) => todo.todo_status === false);
    if (activeTodos.length === 0) {
      const noTodos = document.createElement("div");
      noTodos.classList.add("no-todos");
      noTodos.textContent = "No active Todo";
      cardContainer.appendChild(noTodos);
      return;
    }
    for (let i = 0; i < activeTodos.length; i++) {
      const todo = activeTodos[i];
      const todoTitle = todo.todo_title.toLowerCase();
      if (todoTitle.includes(searchText)) {
        createTodo(todo);
        todosFound = true;
      }
    }

    if (!todosFound) {
      const noTodos = document.createElement("div");
      noTodos.classList.add("no-todos");
      noTodos.textContent = "No matching Todo title";
      cardContainer.appendChild(noTodos);
    }
    return todos;
  } catch (error) {
    return error;
  }
}

let currentMenu = null;
function createTodo(todo) {
  const cardContainer = document.querySelector(".card-container");

  const todo_id = todo._id;
  const todo_title = todo.todo_title;
  const todo_description = todo.todo_description;
  const todo_created = todo.todo_created;
  const todo_status = todo.todo_status;

  const card = document.createElement("div");
  card.setAttribute("todo-id", todo_id);
  card.classList.add("todo-card");
  cardContainer.appendChild(card);

  if (todo_status === true) {
    card.remove();
  }
  // Todo Action
  const todoAction = document.createElement("div");
  todoAction.classList.add("todo-action");
  todoAction.style.display = "none";
  const editAct = document.createElement("div");
  editAct.classList.add("edit-act");
  editAct.textContent = "edit";
  editAct.onclick = () => {
    handleEditTodo(todo_id, todo_title, todo_description);
  };
  const deleteAct = document.createElement("div");
  deleteAct.classList.add("delete-act");
  deleteAct.textContent = "delete";
  deleteAct.onclick = () => {
    handleRemoveTodo(todo_id);
  };
  const completeAct = document.createElement("div");
  completeAct.classList.add("complete-act");
  completeAct.textContent = "complete";
  completeAct.onclick = () => {
    handleCompleteTodo(todo_id);
  };
  todoAction.appendChild(editAct);
  todoAction.appendChild(deleteAct);
  todoAction.appendChild(completeAct);
  card.appendChild(todoAction);

  // Todo body
  const todoBody = document.createElement("div");
  todoBody.classList.add("todo-body");
  card.appendChild(todoBody);

  // Todo Header & title elements
  const todoHeader = document.createElement("div");
  todoHeader.classList.add("todo-header");
  todoBody.appendChild(todoHeader);
  const todoTitle = document.createElement("div");
  todoTitle.classList.add("todo-title");
  todoTitle.textContent = todo_title;

  const cardMenu = document.createElement("div");
  cardMenu.id = "card-menu";

  const iconMenu = document.createElement("i");
  iconMenu.classList.add("fas", "fa-ellipsis-vertical");
  cardMenu.onclick = () => {
    // Check if there is an existing open menu and it is not the same as the clicked menu
    if (currentMenu && currentMenu !== todoAction) {
      // Close the existing open menu
      currentMenu.style.display = "none";
    }
    // Check if the clicked menu is currently closed
    if (todoAction.style.display === "none") {
      // Open the clicked menu
      todoAction.style.display = "flex";
      currentMenu = todoAction; // Set the currentMenu to the clicked menu
    } else {
      // Close the clicked menu
      todoAction.style.display = "none";
      currentMenu = null; // Reset the currentMenu to null since no menu is open
    }
  };
  cardMenu.appendChild(iconMenu);
  todoHeader.appendChild(todoTitle);
  todoHeader.appendChild(cardMenu);

  // Todo content elements
  const todoContent = document.createElement("div");
  todoContent.classList.add("todo-content");
  todoContent.textContent = todo_description;
  todoBody.appendChild(todoContent);

  // Todo footer & date elements
  const todoFooter = document.createElement("div");
  todoFooter.classList.add("todo-footer");
  todoBody.appendChild(todoFooter);
  const todoDate = document.createElement("div");
  todoDate.classList.add("todo-date");
  const formattedDate = formatDate(new Date(todo_created));
  todoDate.textContent = `Added: ${formattedDate}`;
  todoFooter.appendChild(todoDate);
}

async function handleEditTodo(todo_id, todo_title, todo_description) {
  const overlayEditForm = document.querySelector(".overlay-edit-form");
  const editTodoTitle = document.getElementById("edit-todo-title");
  const editTodoDescription = document.getElementById("edit-todo-description");
  const warnFieldEditTitle = document.querySelector(
    ".warning-field.warn-edit-title"
  );
  const btnSaveTodo = document.getElementById("btn-save-todo");
  const btnCancel = document.getElementById("btn-cancel-todo");

  // Show the modal
  overlayEditForm.classList.remove("hidden");

  const closeModal = () => {
    warnFieldEditTitle.classList.add("hidden");
    editTodoTitle.style.borderBottomColor = "";
    overlayEditForm.classList.add("hidden");
  };
  btnCancel.onclick = (e) => {
    e.preventDefault();
    closeModal();
  };

  overlayEditForm.onclick = (e) => {
    if (e.target === overlayEditForm) {
      closeModal();
    }
  };

  try {
    const todo = await getTodoById(todo_id);
    editTodoTitle.value = todo_title;
    editTodoDescription.value = todo_description;
    btnSaveTodo.onclick = (e) => {
      e.preventDefault();
      if (editTodoTitle.value.trim().length >= 1) {
        handleUpdateTodo(todo_id);
      } else {
        editTodoTitle.style.borderBottomColor = "red";
        warnFieldEditTitle.classList.remove("hidden");
        warnFieldEditTitle.textContent = "Title cannot be empty!";
      }
    };
    console.log(todo);
  } catch (error) {
    return error;
  }
}

async function handleUpdateTodo(todo_id) {
  const overlayEditForm = document.querySelector(".overlay-edit-form");
  try {
    const todo_title = document.getElementById("edit-todo-title").value;
    const todo_description = document.getElementById(
      "edit-todo-description"
    ).value;
    // Call the editTodo function to update the todo
    const data = await updateTodo(todo_id, todo_title, todo_description);
    console.log(data);
    displayTodos();

    overlayEditForm.classList.add("hidden");
  } catch (error) {
    console.log(error);
  }
}

async function handleCompleteTodo(todo_id) {
  try {
    const data = await completeTodo(todo_id);
    displayAlert(data.message, "blue");
    displayTodos();
    console.log(data);
  } catch (error) {
    console.log("Error marking todo as complete", error);
  }
}

async function handleRemoveTodo(todo_id) {
  try {
    const data = await deleteTodo(todo_id);
    const card = document.querySelector(`[todo-id="${todo_id}"]`);
    card.remove();
    displayAlert(data.message, "red");
    displayTodos();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function handleRemoveCompletedTodo() {
  try {
    const response = await deleteCompletedTodo();
    displayTodos();
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function handleAddTodo(e) {
  e.preventDefault();
  const addTodoForm = document.getElementById("add-todo-form");
  const addTitleInput = document.getElementById("add-title-input");
  const warnFieldAddTitle = document.querySelector(
    ".warning-field.warn-add-title"
  );
  const addDescriptionInput = document.getElementById("add-description-input");
  const clearInputTitle = document.getElementById("clear-input-title");
  const clearInputDescription = document.getElementById(
    "clear-input-description"
  );
  const btnAddTodo = document.getElementById("btn-add-todo");
  const todo_title = addTitleInput.value.trim();
  const todo_description = addDescriptionInput.value.trim();
  const date = new Date();
  const todo_created = date.toISOString().replace("T", " ").slice(0, 19);
  if (!todo_title) {
    // If todo title is empty, display a warning and don't submit the form
    addTitleInput.style.borderBottomColor = "red";
    warnFieldAddTitle.classList.remove("hidden");
    warnFieldAddTitle.textContent = "Title cannot be empty!";
    return;
  }
  btnAddTodo.disabled = true;
  try {
    const data = await addNewTodo(todo_title, todo_description, todo_created);
    console.log(data, todo_created);
    displayAlert(data.message, "green");
    displayTodos();
    clearInputTitle.style.display = "none";
    clearInputDescription.style.display = "none";
    addTodoForm.reset();
    btnAddTodo.classList.add("submitting");
    btnAddTodo.style.cursor = "not-allowed";
  } catch (error) {
    displayAlert(error.message, "red");
  } finally {
    setTimeout(() => {
      btnAddTodo.disabled = false;
      btnAddTodo.style.cursor = "pointer";
      btnAddTodo.classList.remove("submitting");
    }, 2000);
  }
}

function updateCompletedTodo(todos) {
  const overlayCompletedTodo = document.querySelector(
    ".overlay-completed-todo"
  );
  const completedTodoAction = document.querySelector(".completed-todo-action");
  const unopenedCompletedTodo = document.querySelector(
    ".unopened-completed-todo"
  );
  const openCompletedTodo = document.getElementById("open-completed-todo");
  const closeCompletedTodo = document.getElementById("close-completed-todo");

  openCompletedTodo.onclick = () => {
    unopenedCompletedTodo.classList.add("hidden");
    overlayCompletedTodo.classList.remove("hidden");
  };

  closeCompletedTodo.onclick = () => {
    overlayCompletedTodo.classList.add("hidden");
  };

  overlayCompletedTodo.onclick = (e) => {
    if (e.target === overlayCompletedTodo) {
      overlayCompletedTodo.classList.add("hidden");
    }
  };

  // Update completed todos list
  const completedTodoList = document.querySelector(".completed-todo-list");
  completedTodoList.innerHTML = ""; // Clear previous list

  // Only consider completed todos
  const completedTodos = todos.filter((todo) => todo.todo_status === true);
  if (completedTodos.length === 0) {
    const noCompletedTodos = document.createElement("div");
    noCompletedTodos.classList.add("completed-message");
    noCompletedTodos.textContent = "You have no completed Todo";
    completedTodoList.appendChild(noCompletedTodos);
    return;
  }

  const btnClearAll = document.createElement("button");
  btnClearAll.id = "btn-clear-all";
  btnClearAll.textContent = "Clear All";
  btnClearAll.onclick = () => {
    unopenedCompletedTodo.classList.add("hidden");
    handleRemoveCompletedTodo();
  };

  completedTodoList.prepend(btnClearAll);

  // Sort todos by completed_at field in descending order
  const sortedTodos = completedTodos.sort(
    (a, b) => new Date(a.todo_completed) - new Date(b.todo_completed)
  );

  for (const todo of sortedTodos) {
    const completedTodoBody = document.createElement("div");
    completedTodoBody.classList.add("completed-todo-body");
    completedTodoBody.setAttribute("todo-id", todo._id);
    completedTodoList.appendChild(completedTodoBody);

    const completedTodoHeader = document.createElement("div");
    completedTodoHeader.classList.add("completed-todo-header");
    const completedDetail = document.createElement("button");
    completedDetail.id = "completed-detail";
    completedDetail.onclick = () => {
      dateWrap.classList.toggle("hidden");
      completedTodoDescription.classList.toggle("hidden");
      expandIcon.classList.toggle("fa-circle-info");
      expandIcon.classList.toggle("fa-circle-info");
    };
    const expandIcon = document.createElement("i");
    expandIcon.classList.add("fas", "fa-circle-info");
    completedDetail.appendChild(expandIcon);

    const completedTodoTitle = document.createElement("div");
    completedTodoTitle.classList.add("completed-todo-title");
    completedTodoTitle.textContent = todo.todo_title;
    const completedTodoDescription = document.createElement("div");
    completedTodoDescription.classList.add(
      "completed-todo-description",
      "hidden"
    );
    completedTodoDescription.textContent = todo.todo_description;

    const completedTodoDate = document.createElement("div");
    completedTodoDate.classList.add("completed-todo-date");
    const completedDate = formatDate(new Date(todo.todo_completed));
    const dateWrap = document.createElement("div");
    dateWrap.classList.add("date", "hidden");
    dateWrap.textContent = `Completed: ${completedDate}`;
    completedTodoDate.appendChild(dateWrap);
    completedTodoHeader.appendChild(completedDetail);
    completedTodoHeader.appendChild(completedTodoTitle);
    completedTodoHeader.appendChild(completedTodoDescription);
    completedTodoHeader.appendChild(completedTodoDate);
    completedTodoBody.appendChild(completedTodoHeader);

    unopenedCompletedTodo.classList.remove("hidden");
    completedTodoAction.appendChild(unopenedCompletedTodo);
  }
}

function formatDate(date) {
  const timeZoneOffset = date.getTimezoneOffset(); // Time zone offset in milliseconds
  const localDate = new Date(date.getTime() - timeZoneOffset);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  const formattedDate = localDate.toLocaleString("en-GB", options);
  return formattedDate;
}

let alertElement; // Declare the alert element variable
let timeoutId; // store timeout

function displayAlert(message, type) {
  const alertContainer = document.getElementById("alert-container");

  // Check if an alert element already exists
  if (alertElement) {
    // Remove the previous alert class
    alertElement.classList.remove(
      "alert-green",
      "alert-red",
      "alert-blue"
    );
    // Update the content of the existing alert
    const alertText = alertElement.querySelector(".alert-text");
    alertText.textContent = message;
    // Add the new alert class
    alertElement.classList.add(`alert-${type}`);
    clearTimeout(timeoutId); // Clear the previous timeout
  } else {
    alertElement = document.createElement("div");
    alertElement.classList.add("alert", `alert-${type}`);
    const alertText = document.createElement("div");
    alertText.classList.add("alert-text");
    alertText.textContent = message;
    alertElement.appendChild(alertText);
    alertContainer.appendChild(alertElement);
  }

  timeoutId = setTimeout(() => {
    alertElement.remove();
    alertElement = null; // Reset the alert element variable
  }, 3000);
}

function themeChange() {
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.setAttribute("title", "Light mode");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");

  const rootElem = document.documentElement;
  let dataTheme = rootElem.getAttribute("data-theme");

  themeToggle.onclick = () => {
    if (moonIcon.classList.contains("hidden")) {
      moonIcon.classList.remove("hidden");
      sunIcon.classList.add("hidden");
      themeToggle.setAttribute("title", "Dark mode");

      dataTheme = "dark";
      rootElem.setAttribute("data-theme", "dark");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
      themeToggle.setAttribute("title", "Light mode");

      dataTheme = "light";
      rootElem.setAttribute("data-theme", "light");
    }
    // Set the new localStorage item after toggling the theme
    localStorage.setItem("theme", dataTheme);
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    // Set the theme to the saved preference
    rootElem.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      moonIcon.classList.remove("hidden");
      sunIcon.classList.add("hidden");
      themeToggle.setAttribute("title", "Dark mode");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
      themeToggle.setAttribute("title", "Light mode");
    }
  }
}

function searchTodo() {
  const filterTodo = document.getElementById("search-input");
  filterTodo.onkeyup = () => {
    displayTodos();
  };
  filterTodo.onkeydown = () => {
    displayTodos();
  };
}

let scrollDownTimeout;
function scrollToBottom() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.scrollHeight;
  const scrollDown = document.getElementById("scroll-down");

  clearTimeout(scrollDownTimeout);

  scrollDown.onclick = () => {
    window.scrollTo({
      top: documentHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  // If scrolled to the bottom, hide scrollDown
  if (scrollY + windowHeight >= documentHeight) {
    scrollDown.style.display = "none";
  } else {
    scrollDown.style.display = "block";

    scrollDownTimeout = setTimeout(() => {
      scrollDown.style.display = "none";
    }, 2000);
  }
}
window.addEventListener("scroll", scrollToBottom);

function clearInput() {
  const addTitleInput = document.getElementById("add-title-input");
  const addDescriptionInput = document.getElementById("add-description-input");
  const warnFieldAddTitle = document.querySelector(
    ".warning-field.warn-add-title"
  );
  const clearInputTitle = document.getElementById("clear-input-title");
  const clearInputDescription = document.getElementById(
    "clear-input-description"
  );

  addTitleInput.oninput = () => {
    if (addTitleInput.value.trim()) {
      clearInputTitle.style.display = "block";
      addTitleInput.style.borderBottomColor = "";
      warnFieldAddTitle.classList.add("hidden");
    } else {
      clearInputTitle.style.display = "none";
    }
  };
  addDescriptionInput.oninput = () => {
    if (addDescriptionInput.value.trim()) {
      clearInputDescription.style.display = "block";
      addDescriptionInput.style.borderBottomColor = "";
    } else {
      clearInputDescription.style.display = "none";
    }
  };

  clearInputTitle.onclick = (e) => {
    e.preventDefault();
    addTitleInput.value = "";
    clearInputTitle.style.display = "none";
  };

  clearInputDescription.onclick = (e) => {
    e.preventDefault();
    addDescriptionInput.value = "";
    clearInputDescription.style.display = "none";
  };
}

clearInput();
searchTodo();
themeChange();
const addTodoForm = document.forms.namedItem("add-todo-form");
addTodoForm.addEventListener("submit", handleAddTodo);
displayTodos().then((todo) => console.log(todo));
