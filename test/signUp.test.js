const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const userModel = require('../src/model/userModel.js');
const { signUp } = require('../src/controllers/userController.js');
const { signUpSchema } = require('../src/validations/userValidate.js');
const { cryptPassword } = require('../src/utils/passwordCrypt.js');

chai.use(sinonChai);
const { expect } = chai;

describe('signUp function', function() {
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

    it('signUp function validation fails', async function() {
        req.body = { name: 'John', email: 'invalidemail', password: '123456' };

        await signUp(req, res);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWithMatch({ message: "\"email\" must be a valid email" });
    });

    it('if email already exists', async function() {
        sinon.stub(signUpSchema, 'validate').returns({ error: null, value: {} });
        sinon.stub(userModel, 'findOne').resolves({ email: 'existingemail' });

        await signUp(req, res);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: 'Email already exists' });
    });

    it('error occurs during signUp process', async function() {
        sinon.stub(signUpSchema, 'validate').returns({ error: null, value: {} });
        sinon.stub(userModel, 'findOne').resolves(null);

        await signUp(req, res);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: "Error hashing password" });
    })
});
