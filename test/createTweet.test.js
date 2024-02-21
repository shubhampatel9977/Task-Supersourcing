const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { createTweet } = require('../src/controllers/tweetController.js');
const { tweetSchema } = require('../src/validations/tweetValidate.js');
const userModel = require('../src/model/userModel.js');
const tweetModel = require('../src/model/tweetModel.js');

chai.use(sinonChai);
const { expect } = chai;

describe('createTweet function', function() {
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

    it('createTweet function validation fails', async function() {
        req.body = { user: 'invaliduserid', content: 'Tweet content' };

        await createTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWithMatch({ message: '"user" must only contain hexadecimal characters' });
    });

    it('createTweet function user does not exist', async function() {
        sinon.stub(tweetSchema, 'validate').returns({ error: null, value: {} });
        sinon.stub(userModel, 'findById').resolves(null);

        await createTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: 'User not found' });
    });

    it('tweet is created successfully', async function() {
        sinon.stub(tweetSchema, 'validate').returns({ error: null, value: {} });
        sinon.stub(userModel, 'findById').resolves({ _id: 'validuserid' });
        sinon.stub(tweetModel.prototype, 'save').resolves();

        await createTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'Create tweet successfully' });
    });

    it('createTweet function error occurs while creating tweet', async function() {
        sinon.stub(tweetSchema, 'validate').returns({ error: null, value: {} });
        sinon.stub(userModel, 'findById').resolves({ _id: 'validuserid' });
        sinon.stub(tweetModel.prototype, 'save').rejects(new Error('Database error'));

        await createTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Database error' });
    });
});
