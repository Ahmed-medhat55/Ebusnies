const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
// 2SDRCmN1esWb991T
//connect server to mongo server (cloud DB)
mongoose.connect("mongodb+srv://ahmedmedhat:2SDRCmN1esWb991T@cluster0.jiagqjp.mongodb.net/")
  .then(() => {
    console.log("Database now is connected");

    app.listen(3000, function () {
      console.log("server now is opened");
    });
  })
  .catch((err) => {
    console.error("You have an error");
  });

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  level: String,
  address: String,
});
const doctorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
});

let studentModel = new mongoose.model("Students", studentSchema);
let doctorModel = new mongoose.model("Doctors", doctorSchema);

//1.Add a new student (hardcoded)
app.post("/students/add/hardcoded", async (req, res) => {
  let newStudent = await studentModel({
    name: "Ahmed",
    age: 20,
    level: "2nd",
    address: "Ismailia",
  }).save();
  res.status(201).json({ message: "Hardcoded student added" });
});

//2.Add a new student (from request body)
app.post("/students/add", async (req, res) => {
  let student = await studentModel(req.body).save();
  res.status(201).json({ message: "Student added from request body", student });
});

//3.Add a new doctor (from query parameters)
app.post("/doctors/add", async (req, res) => {
  let { name, age, phone } = req.query;
  if (!name || !age || !phone) {
    return res.status(400).json({ error: "Please put doctor data in query" });
  }
  let doctor = await doctorModel({ name, age: Number(age), phone }).save();
  res.json({ message: "Doctor added from query", doctor });
});

//4.Fetch all students
app.get("/students", async (req, res) => {
  let students = await studentModel.find();
  res.status(200).json(students);
});

//5.Delete a student
app.delete("/studentById", async (req, res) => {
  await studentModel.findByIdAndDelete(req.query.id);
  res.status(200).json({ message: "Student Deleted Successfully" });
});

//6.Update doctors's name
app.put("/doctors/update", async (req, res) => {
  let { oldName, newName } = req.query;
  let doctor = await doctorModel.findOne({ name: oldName });
  if (!doctor) res.status(404).json({ error: "Doctor not found" });
  doctor.name = newName;
});

//7.Fetch all 
app.get("/all", async(req,res)=>{
    res.status(200).json({students,doctors});
});