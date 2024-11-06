const {readJSON}= require('../utils/addStudentUtil');

async function viewStudents(req,res){
    try{
        const allStudents = await readJSON('utils/students.json');
        return res.status(201).json(allStudents);
    } catch(error){
        return res.status(500).json({message: error.message});
    }
}

async function filterStudentsByCourse(course){
    try{
        const allStudents=await readJSON('utils/students.json');
        const searchCourse = course.toLowerCase()
        const filteredStudents = searchCourse == "all" ? allStudents : allStudents.filter(student=>student.course.toLowerCase().includes(searchCourse));
        return {students:filteredStudents};

    }catch(error){
        console.error(error);
        throw error;
    }
}

module.exports = {
    viewStudents, filterStudentsByCourse
};