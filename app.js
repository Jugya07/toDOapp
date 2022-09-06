const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const pass= require(__dirname + "/secrets.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const password = pass.getPass();
mongoose.connect(`mongodb+srv://Jugya07:${password}@cluster0.0gphwix.mongodb.net/toDoListDB`, {
  useNewUrlParser: true,
});

const tasksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Task = mongoose.model("Task", tasksSchema);

const task1 = new Task({
  name: "Welcome to ToDoList!!",
});
const task2 = new Task({
  name: "Click the + button to add your work.",
});
const task3 = new Task({
  name: "<-- Click this to delete your work.",
});

const defaultTasks = [task1, task2, task3];

app.get("/", (req, res) => {
  let day = date.getDate();

  Task.find({}, (err, results) => {
    if (results.length === 0) {
      Task.insertMany(defaultTasks, (err)=> {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { taskTitle: day, newTaskItems: results });
    }
  });
});

app.post("/",  (req, res) => {
  const item = req.body.newItem;

  if(item==''){
    res.redirect("/");
  }else{
    const newTask = new Task({
    name: item,
  });
  newTask.save();
  res.redirect("/");
}
});

app.post("/delete",  (req, res) =>{
  const checkedItemid = req.body.checkbox;

  Task.findByIdAndRemove(checkedItemid,  (err) => {
    if (!err) {
      console.log("Success");
    }
  });
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,  () => {
  console.log("Server is running");
});
