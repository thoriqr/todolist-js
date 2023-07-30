import Todo from "../models/TodoModel.js";

export const getAllTodo = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const completeTodo = async (req, res) => {
  try {
    const completedTodo = await Todo.findById(req.params.id);
    completedTodo.todo_status = true;
    completedTodo.todo_completed = new Date();

    await completedTodo.save();
    res.json({
      message: "Todo Completed!",
      data: completedTodo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addNewTodo = async (req, res) => {
  try {
    const existingTodosCount = await Todo.countDocuments({
      todo_title: { $ne: "" },
    });
    const maxTodoLimit = 20;
    if (existingTodosCount >= maxTodoLimit) {
      return res
        .status(403)
        .json({ message: "You have reached the maximum limit of Todos" });
    }

    const todo = new Todo(req.body);
    if (!todo.todo_title || todo.todo_title.trim() === "") {
      return res.status(400).json({ message: "Title cannot be empty!" });
    }
    todo.todo_status = false;
    todo.todo_created = new Date();

    const saveTodoPromise = todo.save();
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Request time out, Please try again!"));
      }, 5000); // Timeout after 5 seconds
    });

    const insertTodo = await Promise.race([saveTodoPromise, timeoutPromise]);
    res.status(201).json({
      message: "New Todo Added!",
      data: insertTodo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json({
      message: "Todo Updated!",
      data: updatedTodo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Todo Deleted!",
      data: deletedTodo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllCompleted = async (req, res) => {
  try {
    const deletedCompleted = await Todo.deleteMany({ todo_status: true });
    res.status(200).json({
      message: "Completed Todo Deleted!",
      data: deletedCompleted,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
