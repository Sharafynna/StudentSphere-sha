const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../index');
const { readJSON, writeJSON } = require('../utils/updateStudentUtil'); // import original functions to stub them

chai.use(chaiHttp);

let baseUrl;

describe('Student API', () => {
    let readJSONStub, writeJSONStub;

    before(async () => {
        // Start server and set base URL
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;

        // stub readJSON and writeJSON before test
        readJSONStub = sinon.stub();
        writeJSONStub = sinon.stub();
    });

    after(() => {
        sinon.restore();

        // Close the server
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    let studentId = 1730866948666300;

    // Test Suite for editing students
    describe('PUT /edit-student/:id', () => {
        it('should update an existing student', (done) => {
            readJSONStub.resolves([
                {
                    id: studentId,
                    name: 'Old Name',
                    matric_number: 'A9876543X',
                    date_of_birth: '2000-01-01',
                    email: 'oldemail@example.com',
                    contact_no: '87654321',
                    course: 'Computer Science',
                },
            ]);

            writeJSONStub.resolves();

            chai.request(baseUrl)
                .put(`/edit-student/${studentId}`)
                .send({
                    name: 'adam',
                    matric_no: '23097765C',
                    date_of_birth: '2006-06-30',
                    email: 'sharafynna08@gmail.com',
                    contact_no: '83331670',
                    course: 'Information Technology',
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal('Student modified successfully!');
                    done();
                });
        });

        it('should be unable to edit student if there are empty fields or spaces', (done) => {
            readJSONStub.resolves([
                {
                    id: studentId,
                    name: 'Old Name',
                    matric_number: 'A9876543X',
                    date_of_birth: '2000-01-01',
                    email: 'oldemail@example.com',
                    contact_no: '87654321',
                    course: 'Computer Science',
                },
            ]);

            chai.request(baseUrl)
                .put(`/edit-student/${studentId}`)
                .send({
                    name: ' ',
                    matric_no: 'Updated Matric',
                    date_of_birth: '2001-01-06',
                    email: 'updated@example.com',
                    contact_no: '98765432',
                    course: 'Big Data and Analytics',
                })
                .end((err, res) => {
                    expect(res.body.message).to.equal('All fields are required and cannot contain only spaces!');
                    done();
                });
        });

        it('should be unable to edit student if the phone number is not 8 digits long', (done) => {
            readJSONStub.resolves([
                {
                    id: studentId,
                    name: 'Old Name',
                    matric_number: 'A9876543X',
                    date_of_birth: '2000-01-01',
                    email: 'oldemail@example.com',
                    contact_no: '87654321',
                    course: 'Computer Science',
                },
            ]);

            chai.request(baseUrl)
                .put(`/edit-student/${studentId}`)
                .send({
                    name: ' Updated Student Name ',
                    matric_no: 'Updated Matric',
                    date_of_birth: '2001-01-06',
                    email: 'updated@example.com',
                    contact_no: '98765432869076',
                    course: 'Immersive Media and Game Development',
                })
                .end((err, res) => {
                    expect(res.body.message).to.equal('Contact number must be exactly 8 digits!');
                    done();
                });
        });

        it('should be unable to edit student if the email format is wrong', (done) => {
            readJSONStub.resolves([
                {
                    id: studentId,
                    name: 'Old Name',
                    matric_number: 'A9876543X',
                    date_of_birth: '2000-01-01',
                    email: 'oldemail@example.com',
                    contact_no: '87654321',
                    course: 'Computer Science',
                },
            ]);

            chai.request(baseUrl)
                .put(`/edit-student/${studentId}`)
                .send({
                    name: ' Updated Student Name ',
                    matric_no: 'Updated Matric',
                    date_of_birth: '2001-01-06',
                    email: 'updatedexample.com',
                    contact_no: '98765432',
                    course: 'Immersive Media and Game Development',
                })
                .end((err, res) => {
                    expect(res.body.message).to.equal('Invalid email format!');
                    done();
                });
        });
    });
});
