import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config"
import TodoRoute from "./routes/TodoRoute.js"

const port = process.env.PORT
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME

const app = express();
mongoose.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.oaxsgnq.mongodb.net/${db_name}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Database connected!"))

app.use(cors())
app.use(express.json());
app.use(TodoRoute)

app.get("/", (req, res) => {
  res.writeHead(200, {"Content-Type" : "text/plain"})
  res.end("todolist-js API")
})

app.listen(port, () => console.log("Server running at port 4000"))