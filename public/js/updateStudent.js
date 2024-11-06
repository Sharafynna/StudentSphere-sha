function editStudent(data) {
    var selectedStudent = JSON.parse(data);

    document.getElementById("editMatric_no").value = selectedStudent.matric_no;
    document.getElementById("editName").value = selectedStudent.name;
    document.getElementById("editDate_of_birth").value = selectedStudent.date_of_birth;
    document.getElementById("editEmail").value = selectedStudent.email;
    document.getElementById("editContact_no").value = selectedStudent.contact_no;
    document.getElementById("editCourse").value = selectedStudent.course;

    document.getElementById("updateButton").setAttribute("onclick", 'updateStudent("' + selectedStudent.id + '")');
        
        $('#editStudentModal').modal('show');
}


function updateStudent(id) {
    console.log(id)
    var response = "";

    var jsonData = new Object();
    jsonData.matric_no = document.getElementById("editMatric_no").value.trim();
    jsonData.name = document.getElementById("editName").value.trim();
    jsonData.date_of_birth = document.getElementById("editDate_of_birth").value.trim();
    jsonData.email = document.getElementById("editEmail").value.trim();
    jsonData.contact_no = document.getElementById("editContact_no").value.trim();
    jsonData.course = document.getElementById("editCourse").value.trim();

    if (!jsonData.name || !jsonData.matric_no  || !jsonData.date_of_birth || !jsonData.email || !jsonData.contact_no || !jsonData.course ) {
            document.getElementById("editMessage").innerHTML = 'All fields are required and cannot contain only spaces!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();

    request.open("PUT", "/edit-student/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);

        if (response.message == "Students modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Student Information: ' + jsonData.name + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
            window.location.href = 'index.html';
        }
        else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit student information!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
    console.log(jsonData); // Log the data being sent

}