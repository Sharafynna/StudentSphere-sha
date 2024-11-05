var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5050
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { addStudent, viewStudents, filterStudentsByCourse, editStudent } = require('./utils/StudentUtil')
app.post('/add-student', addStudent);
app.get('/view-students', viewStudents);
app.put('/update-student/:id', editStudent);

app.get('/students-by-course',async(req,res)=>{
    try{
        const course=req.query.course;
        const filteredStudents= await filterStudentsByCourse(course);
        if (filteredStudents.students.length === 0){
            return res.status(200).json({message: `No students found for the filtered course: ${course}`})
        }
        else{
            return res.status(201).json(filteredStudents.students);
        }
    }catch(error){
        return res.status(500).json({message: error.message});
    }
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})
server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`DVOPS project at: ${baseUrl}`);
});

module.exports = { app, server }