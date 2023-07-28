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
      message: "Todo is completed and status changed",
      data: completedTodo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addNewTodo = async (req, res) => {
  const todo = new Todo(req.body);
  try {
    todo.todo_status = false;
    todo.todo_created = new Date();
    const insertTodo = await todo.save();
    res.status(201).json({
      message: "Insert Todo Successfully",
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
      message: "Update Todo Successfully",
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
      message: "Delete Todo Successfully",
      data : deletedTodo
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllCompleted = async (req, res) => {
  try {
    const deletedCompleted = await Todo.deleteMany({todo_status: true})
    res.status(200).json({
      message: "Delete Completed Todo Successfully",
      data: deletedCompleted
    })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
