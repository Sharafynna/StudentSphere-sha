const { describe, it } = require('mocha');
const { expect } = require('chai');

const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;

describe('Student API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;
    });
    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    let studentId=1730866948666300;

    // Test Suite for editing students
    describe('PUT /edit-student/:id', () => {
        it('should update an existing student', (done) => {
            chai.request(baseUrl)
                .put(`/edit-student/${studentId}`)
                .send({
                    name: 'adham',
                    matric_no: '23097765C',
                    date_of_birth:'2006-06-30',
                    email: 'sharafynna08@gmail.com',
                    contact_no: '83331670',
                    course: 'Information Technology'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal('Student modified successfully!');
                    done();
                });
        });
        it('should return 404 if the student does not exist', (done) => {
            chai.request(baseUrl)
                .put('/edit-student/nonexistent-id')
                .send({
                    name: 'Updated Name',
                    matric_no: 'Updated Matric',
                    date_of_birth: 2001-0o1-0o6,
                    email: 'updated@example.com',
                    contact_no: 9876543210,
                    course: 'Updated Course'
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body.message).to.equal('Student not found!');
                    done();
                });
        });
    });
});
