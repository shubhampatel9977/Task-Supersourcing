const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { followUser } = require('../src/controllers/followController.js');
const { followSchema } = require('../src/validations/followValidate.js');
const userModel = require('../src/model/userModel.js');

chai.use(sinonChai);
const { expect } = chai;

describe('followUser function', function() {
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

    it('should return 400 if validation fails', async function() {
        req.body = { user: 'invaliduserid' };

        await followUser(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWithMatch({ message: '"user" must only contain hexadecimal characters' });
    });

    it('followUser function user to follow is not found', async function() {
        req.body = { user: 'validuserid', followUserId: 'invaliduserid' };
        sinon.stub(followSchema, 'validate').returns({ error: null, value: req.body });
        sinon.stub(userModel, 'findById').withArgs('invaliduserid', { password: 0 }).resolves(null);

        await followUser(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: 'User not found' });
    });

    it('followUser function user is already followed', async function() {
        req.body = { user: 'validuserid', followUserId: 'alreadyfolloweduserid' };
        sinon.stub(followSchema, 'validate').returns({ error: null, value: req.body });
        sinon.stub(userModel, 'findById').withArgs('validuserid', { password: 0 }).resolves({ following: ['alreadyfolloweduserid'] });

        await followUser(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: 'Follow not found' });
    });

    it('should handle errors gracefully', async function() {
        req.body = { user: 'validuserid', followUserId: 'newuserid' };
        sinon.stub(followSchema, 'validate').throws(new Error('Validation error'));

        await followUser(req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Validation error' });
    });
});
