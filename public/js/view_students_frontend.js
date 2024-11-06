//function for loading students for view feature
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
        document.getElementById('tableContent').innerHTML = html;
    };
    request.send();
}

//function for filtering students by course
function filterStudentsByCourse() {
    
    //resetting the filterMessage each time that the user clicks the filter button
    document.getElementById("filterMessage").innerHTML = '';

    const course = document.getElementById("courseFilter").value.toLowerCase();

    //showing error message if there is no filter input
    if (course == "" || !course || course.trim() === "") {
        document.getElementById("filterMessage").innerHTML = 'Please enter the course name to filter';
        document.getElementById("filterMessage").setAttribute("class", "text-danger");
        alert("The students are not filtered.")
        return viewStudents();
    }

    //showing all the students if the input is "all"
    if (course=== "all") {
        alert("The student list contains all the students registered.")
        return viewStudents();
    }

    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', `/students-by-course?course=${encodeURIComponent(course)}`, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);

        if (response.message) {
            document.getElementById("tableContent").innerHTML = '<tr>' +
                '<td colspan = "6" class = "text-center">' + response.message + '</td>' +
                '<tr>';
        }if(response.length===0){
            document.getElementById("tableContent").innerHTML = '<tr>' +
                '<td colspan = "6" class = "text-center">There are no students registered with the provided course.</td>' +
                '<tr>';
        } else {
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
            alert(`The student list is now filtered by course: ${course}`);
        }
    };
    request.send();
}

module.exports={
    viewStudents
};