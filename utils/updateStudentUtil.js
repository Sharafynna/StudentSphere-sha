const { promises: fs } = require('fs');

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file: ${filename}`, err);
        throw new Error('Could not read data.');
    }
}

async function writeJSON(data, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing to file: ${filename}`, err);
        throw new Error('Could not save data.');
    }
}

async function editStudent(req, res) {
    try {
        const id = req.params.id;
        const { name, matric_no, date_of_birth, email, contact_no, course } = req.body;

        //checking if got any empty fields or only spaces
        if (!name || name.trim() === "" || 
            !matric_no || matric_no.trim() === "" || 
            !date_of_birth || 
            !email || 
            !contact_no || 
            !course || course.trim() === "") {
            return res.status(400).json({ message: 'All fields are required and cannot contain only spaces!' });
        }

        //check if email is correct format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format!' });
        }

        // check if phone number is 8 numbers long
        if (contact_no.length !== 8 || isNaN(contact_no)) {
            return res.status(400).json({ message: 'Contact number must be exactly 8 digits!' });
        }

        const allStudents = await readJSON('utils/students.json');
        let modified = false;

        for (let i = 0; i < allStudents.length; i++) {
            if (allStudents[i].id == id) {
                allStudents[i].name = name;
                allStudents[i].matric_number = matric_no;
                allStudents[i].date_of_birth = date_of_birth;
                allStudents[i].email = email;
                allStudents[i].contact_no = contact_no;
                allStudents[i].course = course;
                modified = true;
            }
        }

        if (modified) {
            await writeJSON(allStudents, 'utils/students.json');
            return res.status(201).json({ message: 'Student modified successfully!' });
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