class Student {
    constructor(name, matric_no, date_of_birth, email, contact_no, course) {
        this.name = name;
        this.matric_no = matric_no;
        this.date_of_birth = date_of_birth
        this.email = email;
        this.contact_no = contact_no;
        this.course = course;

        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}
module.exports = { Student };