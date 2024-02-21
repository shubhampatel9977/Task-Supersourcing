const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { getUsers } = require('../src/controllers/userController.js');
const userModel = require('../src/model/userModel.js');

chai.use(sinonChai);
const { expect } = chai;

describe('getUsers function', function() {
    let req, res, next;

    beforeEach(function() {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(function() {
        sinon.restore();
    });

    it('should return all users with password excluded', async function() {
        const users = [
            {
                "_id": "65d465328a03dae54f02a6f6",
                "name": "Demo",
                "email": "demo@gmail.com",
                "following": [],
                "__v": 6
            },
            {
                "_id": "65d4713ebb126ec9fd2cded9",
                "name": "Demo2",
                "email": "demo2@gmail.com",
                "following": [],
                "__v": 0
            },
            {
                "_id": "65d47146bb126ec9fd2cdedc",
                "name": "Demo3",
                "email": "demo3@gmail.com",
                "following": [],
                "__v": 0
            }
        ];

        sinon.stub(userModel, 'find').resolves(users);

        await getUsers(req, res, next);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ data: [{
            "_id": "65d465328a03dae54f02a6f6",
            "name": "Demo",
            "email": "demo@gmail.com",
            "following": [],
            "__v": 6
        },
        {
            "_id": "65d4713ebb126ec9fd2cded9",
            "name": "Demo2",
            "email": "demo2@gmail.com",
            "following": [],
            "__v": 0
        },
        {
            "_id": "65d47146bb126ec9fd2cdedc",
            "name": "Demo3",
            "email": "demo3@gmail.com",
            "following": [],
            "__v": 0
        }] });
    });

    it('getUsers function error occurs while fetching users', async function() {
        sinon.stub(userModel, 'find').rejects(new Error('Database error'));

        await getUsers(req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Database error' });
    });
});
