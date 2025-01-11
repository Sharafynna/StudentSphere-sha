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
    jsonData.matric_no = document.getElementById("editMatric_no").value;
    jsonData.name = document.getElementById("editName").value;
    jsonData.date_of_birth = document.getElementById("editDate_of_birth").value;
    jsonData.email = document.getElementById("editEmail").value;
    jsonData.contact_no = document.getElementById("editContact_no").value;
    jsonData.course = document.getElementById("editCourse").value;

    if (!jsonData.name || !jsonData.matric_no  || !jsonData.date_of_birth || !jsonData.email || !jsonData.contact_no || !jsonData.course ) {
            document.getElementById("editMessage").innerHTML = 'All fields are required and cannot contain only spaces!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    // Check email 
    var emailField = document.getElementById("editEmail");
    if (!emailField.checkValidity()) {
        document.getElementById("editMessage").innerHTML = 'Invalid email format!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    // Check phone number length
    if (jsonData.contact_no.length !== 8 || isNaN(jsonData.contact_no)) {
        document.getElementById("editMessage").innerHTML = 'Contact number must be exactly 8 digits!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();

    request.open("PUT", "/edit-student/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status === 201) {
            const response = JSON.parse(request.responseText);
            document.getElementById("editMessage").innerHTML = 'Student modified successfully!';


        if (request.status === 201) {
            const response = JSON.parse(request.responseText);
            document.getElementById("editMessage").innerHTML = 'Student modified successfully!';

        response = JSON.parse(request.responseText);

        if (response.message == "Student modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Student Information: ' + jsonData.name + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
        } else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit student information!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };
    
    request.send(JSON.stringify(jsonData));
    console.log(jsonData); // Log the data being sent
}}};