const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const userModel = require('../src/model/userModel.js');
const { logIn } = require('../src/controllers/userController.js');
const { logInSchema } = require('../src/validations/userValidate.js');

chai.use(sinonChai);
const { expect } = chai;

describe('logIn function', function() {
    let req, res, next;

    beforeEach(function() {
        req = { body: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(function() {
        sinon.restore();
    });

    it('logIn function validation fails', async function() {
        req.body = { email: 'invalidemail', password: '123456' };

        await logIn(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWithMatch({ message: "\"email\" must be a valid email" });
    });

    it('logIn function with "Email or Password Incorrect" message if user does not exist', async function() {
        sinon.stub(logInSchema, 'validate').returns({ error: null, value: {} });
        sinon.stub(userModel, 'findOne').resolves(null);

        await logIn(req, res, next);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'Email or Password Incorrect' });
    })
});