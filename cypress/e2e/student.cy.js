describe('Student Sphere Frontend', () => {
  let baseUrl;

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl);
    });
  });

  after(() => {
    return cy.task('stopServer'); // Stop the server after the report is done
  });

  it('should update an existing student', () => {
    cy.visit(baseUrl);
    cy.wait(500);

    // Click the edit button for the student
    cy.get('button.btn').filter(':contains("Edit")').last().click({ force: true });

    // Update student details  
    cy.get('#editMatric_no').clear().type('6784332M');
    cy.get('#editName').clear().type('Updated Student Name');
    cy.get('#editDate_of_birth').clear().type('1973-11-07');
    cy.get('#editEmail').clear().type('updated@example.com');
    cy.get('#editContact_no').clear().type('96654573');
    cy.get('#editCourse').select('Information Technology');

    // Click the update student button
    cy.get('button.btn').filter(':contains("Update Student")').last().click({ force: true }); 

    // Verify the student is updated in the table
    cy.get('#tableContent').contains('Updated Student Name').should('exist');
    cy.get('#tableContent').contains('Test Student').should('not.exist');
  });
});
