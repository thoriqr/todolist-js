// GET ALL TODO
export function getAllTodo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const request = new Request("https://itchy-seal-wig.cyclic.app/todos", {
        method: "GET",
      });
      fetch(request)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              return reject(new Error("404 Not Found"));
            } else if (response.status === 500) {
              return reject(new Error("500 Internal Server Error"));
            } else {
              return reject(new Error(response.statusText));
            }
          }
          return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    }, 1000); // Adjust the delay time as needed
  });
}

// ADD TODO
export function addNewTodo(todo_title, todo_description) {
  const newTodo = {
    todo_title: todo_title,
    todo_description: todo_description,
  };
  const request = new Request("https://itchy-seal-wig.cyclic.app/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  const response = fetch(request);
  return response.then((response) => {
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message);
      });
    }
    return response.json();
  });
}

// SINGLE TODO
export function getTodoById(todo_id) {
  const request = new Request(
    `https://itchy-seal-wig.cyclic.app/todos/${todo_id}`,
    {
      method: "GET",
    }
  );
  const response = fetch(request);
  return response.then((response) => response.json());
}

// UPDATE TODO
export function updateTodo(todo_id, todo_title, todo_description) {
  const updatedTodo = {
    todo_title: todo_title,
    todo_description: todo_description,
  };
  const request = new Request(
    `https://itchy-seal-wig.cyclic.app/todos/${todo_id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    }
  );
  const response = fetch(request);
  return response.then((response) => response.json());
}

// COMPLETE TODO
export function completeTodo(todo_id) {
  const request = new Request(
    `https://itchy-seal-wig.cyclic.app/todos/${todo_id}/completed`,
    {
      method: "PUT",
    }
  );
  const response = fetch(request);
  return response.then((response) => response.json());
}

// DELETE TODO BY ID
export function deleteTodo(todo_id) {
  const request = new Request(
    `https://itchy-seal-wig.cyclic.app/todos/${todo_id}`,
    {
      method: "DELETE",
    }
  );
  const response = fetch(request);
  return response.then((response) => response.json());
}

// DELETE COMPLETED TODO
export function deleteCompletedTodo() {
  const request = new Request(`https://itchy-seal-wig.cyclic.app/todos/`, {
    method: "DELETE",
  });
  const response = fetch(request);
  return response.then((response) => response.json());
}
