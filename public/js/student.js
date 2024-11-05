function addStudent() {
    var response = "";
    var jsonData = new Object();

    // Collect data from form fields
    jsonData.name = document.getElementById("name").value;
    jsonData.matric_no = document.getElementById("matric_no").value;
    jsonData.date_of_birth = document.getElementById("date_of_birth").value;
    jsonData.email = document.getElementById("email").value;
    jsonData.contact_no = document.getElementById("contact_no").value;
    jsonData.course = document.getElementById("course").value;

    // Check if required fields are filled
    if (
        jsonData.name === "" || 
        jsonData.matric_no === "" || 
        jsonData.date_of_birth === "" || 
        jsonData.email === "" || 
        jsonData.contact_no === "" || 
        jsonData.course === ""
    ) {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    // Create and send XMLHttpRequest
    var request = new XMLHttpRequest();
    request.open("POST", "/add-student", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);

        if (response.message === undefined) {
            document.getElementById("message").innerHTML = 'Added Student: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");

            // Clear form fields after successful addition
            document.getElementById("name").value = "";
            document.getElementById("matric_no").value = "";
            document.getElementById("date_of_birth").value = "";
            document.getElementById("email").value = "";
            document.getElementById("contact_no").value = "";
            document.getElementById("course").value = "";

            // Optionally redirect to a new page
            window.location.href = 'index.html';
        } else {
            document.getElementById("message").innerHTML = 'Unable to add student!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    // Send JSON data
    request.send(JSON.stringify(jsonData));
}

document.addEventListener('DOMContentLoaded', function() {
function viewStudents() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-students', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + response[i].matric_no + '</td>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' + response[i].date_of_birth + '</td>' +
                '<td>' + response[i].email + '</td>' +
                '<td>' + response[i].contact_no + '</td>' +
                '<td>' + response[i].course + '</td>' +
                '<td>' +
                '<button type="button" class="btn edit-btn" onclick="editStudent(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' +
                '</td>' +
                '</tr>'
        }
         // Check if the tableContent element is found
         const tableContent = document.getElementById('tableContent');
         if (tableContent) {
             tableContent.innerHTML = html;
         } else {
             console.error('Element with ID tableContent not found');
         }
     };
    request.send();
}

function editStudent(studentData) {
    // Parse student data to use in the form
    var data = JSON.parse(studentData);
    document.getElementById("name").value = data.name;
    document.getElementById("matric_no").value = data.matric_no;
    document.getElementById("date_of_birth").value = data.date_of_birth;
    document.getElementById("email").value = data.email;
    document.getElementById("contact_no").value = data.contact_no;
    document.getElementById("course").value = data.course;

    // Change button functionality from "Add" to "Save"
    document.getElementById("submitButton").innerText = "Save";
    document.getElementById("submitButton").onclick = function () {
        saveEdit(data.matric_no); // Use matric_no to identify the student to update
    };
}

function saveEdit(matric_no) {
    var response = "";
    var jsonData = new Object();

    // Collect updated data from form fields
    jsonData.name = document.getElementById("name").value;
    jsonData.matric_no = matric_no; // Keep original matric_no for identification
    jsonData.date_of_birth = document.getElementById("date_of_birth").value;
    jsonData.email = document.getElementById("email").value;
    jsonData.contact_no = document.getElementById("contact_no").value;
    jsonData.course = document.getElementById("course").value;

    // Check if required fields are filled
    if (
        jsonData.name === "" || 
        jsonData.date_of_birth === "" || 
        jsonData.email === "" || 
        jsonData.contact_no === "" || 
        jsonData.course === ""
    ) {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    // Create and send XMLHttpRequest
    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-student", true); // Assume PUT method for editing
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);

        if (response.message === "Success") {
            document.getElementById("message").innerHTML = 'Updated Student: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");

            // Clear form fields and reset button
            document.getElementById("name").value = "";
            document.getElementById("matric_no").value = "";
            document.getElementById("date_of_birth").value = "";
            document.getElementById("email").value = "";
            document.getElementById("contact_no").value = "";
            document.getElementById("course").value = "";
            document.getElementById("submitButton").innerText = "Add";
            document.getElementById("submitButton").onclick = addStudent;

            // Refresh students list
            viewStudents();
        } else {
            document.getElementById("message").innerHTML = 'Unable to update student!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    // Send JSON data
    request.send(JSON.stringify(jsonData));
}
})