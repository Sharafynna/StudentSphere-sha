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

async function editStudent(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const matric_no = req.body.matric_no;
        const date_of_birth = req.body.date_of_birth;
        const email = req.body.email;
        const contact_no = req.body.contact_no;
        const course = req.body.course;

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
    readJSON, writeJSON, editStudent
};
