import express from "express";
import {
  getAllTodo,
  getTodoById,
  addNewTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
  deleteAllCompleted,
} from "../controllers/TodoController.js";

const router = express.Router();

router.get("/todos", getAllTodo);
router.get("/todos/:id", getTodoById);
router.post("/todos", addNewTodo);
router.patch("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);
router.put("/todos/:id/completed", completeTodo);
router.delete("/todos", deleteAllCompleted);

export default router;
