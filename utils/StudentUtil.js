const { Student } = require('../models/Student');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}
async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}
async function addStudent(req, res) {
    try {
        const { name, matric_no, date_of_birth, email, contact_no, course } = req.body;

        // Validation
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (contact_no.length < 8 || isNaN(contact_no)) {
            return res.status(400).json({ message: 'Invalid contact number' });
        }
        if (!course || course.length < 3) {
            return res.status(400).json({ message: 'Course name too short' });
        }

        const newStudent = new Student(name, matric_no, date_of_birth, email, contact_no, course);
        const updatedStudents = await writeJSON(newStudent, 'utils/students.json');

        return res.status(201).json(updatedStudents);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewStudents(req, res) {
    try {
        const allStudents = await readJSON('utils/students.json');
        return res.status(201).json(allStudents);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function filterStudentsByCourse(course) {
    try {
        const allStudents = await readJSON('utils/students.json');
        const filteredStudents = allStudents.filter(student => student.course === course);
        return { students: filteredStudents };

    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function editStudent(req, res) {
    try {
        const id = req.params.id;
        const name = req.params.name;
        const matric_no = req.params.matric_no;
        const date_of_birth = req.params.date_of_birth;
        const email = req.params.email;
        const contact_no = req.params.contact_no;
        const course = req.params.course;

        const allStudents = await readJSON('utils/students.json');

        var modified = false;

        for (var i = 0; i < allStudents.length; i++) {
            var curcurrStudents = allStudents[i];
            if (curcurrStudents.id == id) {
                allStudents[i].name = name;
                allStudents[i].matric_no = matric_no;
                allStudents[i].date_of_birth = date_of_birth;
                allStudents[i].email = email;
                allStudents[i].contact_no = contact_no;
                allStudents[i].course = course;
                modified = true;
            }
        }
        if (modified) {
            await fs.writeFile('utils/students.json', JSON.stringify(allStudents), 'utf8');
            return res.status(201).json({ message: 'Students modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addStudent, viewStudents, filterStudentsByCourse, editStudent
};
