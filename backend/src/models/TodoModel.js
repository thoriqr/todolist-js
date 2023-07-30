import mongoose from "mongoose";

const Todo = mongoose.Schema({
  todo_title: {
    type: String,
    required: true,
  },
  todo_description: {
    type: String,
    required: false,
  },
  todo_created: {
    type: Date,
    required: false,
  },
  todo_completed: {
    type: Date,
    required: false,
  },
  todo_status: {
    type: Boolean,
    required: false,
  },
});

export default mongoose.model("Todos", Todo);
