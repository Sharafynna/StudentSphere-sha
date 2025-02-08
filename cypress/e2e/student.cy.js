describe('Student Sphere Frontend', () => {
  let baseUrl;

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl, { timeout: 60000 });
    });
  });

  after(() => {
    return cy.task('stopServer'); // Stop the server after the report is done
  });

  it('should update an existing student', () => {
    cy.visit(baseUrl);
    cy.wait(10000);
  
    cy.intercept('PUT', '/edit-student/*', (req) => {
      req.reply((res) => {
          console.log('Intercepted Response:', res);
          console.log('Status Code:', res.statusCode); // ✅ Log status code
          console.log('Response Body:', res.body); // ✅ Log full response
      });
    }).as('updateStudent');
  
    
  
    // Click the edit button for the student
    cy.get('button.btn').filter(':contains("Edit")').last().click();
    cy.wait(2000); // ✅ Ensure modal loads before typing
    cy.get('#editStudentModal').should('be.visible'); // ✅ Ensure modal is open

  
    // Update student details  
    cy.get('#editMatric_no').clear().type('6784332A', {force:true});
    cy.get('#editName').clear().type('Updated Student Name');
    cy.get('#editDate_of_birth').clear().type('1973-11-07');
    cy.get('#editEmail').clear().type('updated@example.com');
    cy.get('#editContact_no').clear().type('96654573');
    cy.get('#editCourse').select('Information Technology');
    cy.wait(1000);
  
    // Click the update student button
    cy.get('#updateButton').click();
  
    // Wait for the intercepted PUT request
    cy.wait('@updateStudent', { timeout: 15000 }).then((interception) => {
      console.log('Intercepted Request Body:', interception.request.body);
      console.log('Intercepted Response:', interception.response);
      expect(interception.response.statusCode).to.eq(200); // ✅ Ensure successful response
    });
  
  
    // Wait for the success message
    cy.wait(2000);
    cy.get('#editMessage').should('be.visible').and('have.text', 'Student modified successfully!');
  
    // Verify the student is updated in the table
    cy.get('#tableContent').contains('Updated Student Name').should('exist');
    cy.get('#tableContent').contains('Test Student').should('not.exist');
  });
  
  
  it("should be unable to update an existing student - empty fields", () => {
    cy.visit(baseUrl);
    cy.wait(1000);

    // Click the edit button for the student
    cy.get('button.btn').filter(':contains("Edit")').last().click();

    // Update student details  
    cy.get('#editMatric_no').clear().type('6784332A', {force:true});
    cy.get('#editName').clear();
    cy.get('#editDate_of_birth').clear().type('1973-11-07');
    cy.get('#editEmail').clear().type('updated@example.com');
    cy.get('#editContact_no').clear().type('96654573');
    cy.get('#editCourse').select('Information Technology');
    cy.wait(1000);

    // Click the update student button
    cy.get('#updateButton').click(); 

    // Log the message content when failing
    cy.get('#editMessage').then(($message) => {
      console.log('Error Message:', $message.text()); // Log the error message
    });

    cy.get('#editMessage').should('have.text','All fields are required and cannot contain only spaces!');
    cy.wait(1000);

    // Verify the student is updated in the table
    cy.get('#tableContent').contains('Updated Student Name').should('exist');
    cy.get('#tableContent').contains('Test Student').should('not.exist');
  });

  it("should be unable to update an existing student - invalid email format", () => {
    cy.visit(baseUrl);
    cy.wait(1000);

    // Click the edit button for the student
    cy.get('button.btn').filter(':contains("Edit")').last().click();

    // Update student details  
    cy.get('#editMatric_no').clear().type('6784332A', {force:true});
    cy.get('#editName').clear().type('Updated Student Name');
    cy.get('#editDate_of_birth').clear().type('1973-11-07');
    cy.get('#editEmail').clear().type('updatedexample.com');
    cy.get('#editContact_no').clear().type('96654573');
    cy.get('#editCourse').select('Information Technology');
    cy.wait(500);

    // Click the update student button
    cy.get('#updateButton').click(); 

    cy.get('#editMessage').should('have.text','Invalid email format!');
    cy.wait(1000);

    // Verify the student is updated in the table
    cy.get('#tableContent').contains('Updated Student Name').should('exist');
    cy.get('#tableContent').contains('Test Student').should('not.exist');
  });

  it("should be unable to update an existing student - invalid phone number", () => {
    cy.visit(baseUrl);
    cy.wait(1000);

    // Click the edit button for the student
    cy.get('button.btn').filter(':contains("Edit")').last().click();

    // Update student details  
    cy.get('#editMatric_no').clear().type('6784332A', {force:true});
    cy.get('#editName').clear().type('Updated Student Name');
    cy.get('#editDate_of_birth').clear().type('1973-11-07');
    cy.get('#editEmail').clear().type('updated@example.com');
    cy.get('#editContact_no').clear().type('96654573767956');
    cy.get('#editCourse').select('Information Technology'); 
    cy.wait(1000);

    // Click the update student button
    cy.get('#updateButton').click(); 
    cy.get('#editMessage').should('have.text','Contact number must be exactly 8 digits!');
  });
});