const { promises: fs } = require('fs');

// Function to read JSON file
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file: ${filename}`, err);
        throw new Error('Could not read data.');
    }
}

// Function to write JSON file
async function writeJSON(data, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing to file: ${filename}`, err);
        throw new Error('Could not save data.');
    }
}

// Function to edit student
async function editStudent(req, res) {
    try {
        const id = req.params.id;
        const { name, matric_no, date_of_birth, email, contact_no, course } = req.body;

        // Check if any fields are empty or contain only spaces
        if (!name || name.trim() === "" || 
            !matric_no || matric_no.trim() === "" || 
            !date_of_birth || 
            !email || 
            !contact_no || 
            !course || course.trim() === "") {
            return res.status(400).json({ message: 'All fields are required and cannot contain only spaces!' });
        }

        // Check if email is in correct format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format!' });
        }

        // Check if contact number is exactly 8 digits
        if (contact_no.length !== 8 || isNaN(contact_no)) {
            return res.status(400).json({ message: 'Contact number must be exactly 8 digits!' });
        }

        // Read all students data
        const allStudents = await readJSON('utils/students.json');

        let modified = false;

        // Update the student data
        for (let i = 0; i < allStudents.length; i++) {
            if (allStudents[i].id == id) {
                allStudents[i].name = name;
                allStudents[i].matric_no = matric_no;
                allStudents[i].date_of_birth = date_of_birth;
                allStudents[i].email = email;
                allStudents[i].contact_no = contact_no;
                allStudents[i].course = course;
                modified = true;
            }
        }

        // Save the updated student data
        if (modified) {
            await writeJSON(allStudents, 'utils/students.json');
            return res.status(200).json({ message: 'Student modified successfully!' });

        } else {
            return res.status(500).json({ message: 'Student not found!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    editStudent,
};
