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

function filterStudentsByCourse() {
    const course= document.getElementsByName("courseFilter");
    let selectedcourse = '';

    for (let i =0; i<course.length; i++){
        if(course[i].checked){
            selectedcourse=course[i].value;
            break;
        }
    }

    if(selectedcourse==="all"){
        return viewStudents();
    }
    
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', `/students-by-course?course=${encodeURIComponent(selectedcourse)}`, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);

        if(response.message){
            document.getElementById("tableContent").innerHTML='<tr>'+ 
            '<td colspan = "6" class = "text-center">'+ response.message + '</td>' +
            '<tr>';
        }else{
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
        document.getElementById('tableContent').innerHTML = html;
        }  
    };
    request.send();
}