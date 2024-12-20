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

        const newStudent = new Student(name, matric_no, date_of_birth, email, contact_no, course);
        const updatedStudents = await writeJSON(newStudent, 'utils/students.json');

        return res.status(201).json(updatedStudents);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addStudent
};
