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
        } else if (request.status === 400) {
            // Error: Display the message from the backend
            document.getElementById("message").innerHTML = response.message;
            document.getElementById("message").setAttribute("class", "text-danger");
        } else {
            document.getElementById("message").innerHTML = 'Unable to add student!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    // Send JSON data
    request.send(JSON.stringify(jsonData));
}     