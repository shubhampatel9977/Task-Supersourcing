const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { updateTweet } = require('../src/controllers/tweetController.js');
const { tweetIdSchema, tweetSchema } = require('../src/validations/tweetValidate.js');
const tweetModel = require('../src/model/tweetModel.js');

chai.use(sinonChai);
const { expect } = chai;

describe('updateTweet function', function() {
    let req, res, next;

    beforeEach(function() {
        req = { params: {}, body: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(function() {
        sinon.restore();
    });

    it('updateTweet function validation for tweet ID fails', async function() {
        req.params = { tweetId: 'invalidtweetid' };

        await updateTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWithMatch({ message: '"tweetId" must only contain hexadecimal characters' });
    });

    it('updateTweet function validation for tweet content fails', async function() {
        req.params = { tweetId: 'validtweetid' };
        req.body = { user: 'validuserid', content: '' };

        await updateTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWithMatch({ message: '"tweetId" must only contain hexadecimal characters' });
    });

    it('updateTweet function user or tweet not found', async function() {
        sinon.stub(tweetIdSchema, 'validate').returns({ error: null, value: { tweetId: 'validtweetid' } });
        sinon.stub(tweetSchema, 'validate').returns({ error: null, value: { user: 'validuserid', content: 'Updated content' } });
        sinon.stub(tweetModel, 'findOne').resolves(null);

        await updateTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({ message: 'User or Tweet not found' });
    });

    it('updateTweet function tweet is updated successfully', async function() {
        const updatedTweet = { _id: 'validtweetid', user: 'validuserid', content: 'Updated content', createdAt: new Date() };

        sinon.stub(tweetIdSchema, 'validate').returns({ error: null, value: { tweetId: 'validtweetid' } });
        sinon.stub(tweetSchema, 'validate').returns({ error: null, value: { user: 'validuserid', content: 'Updated content' } });
        sinon.stub(tweetModel, 'findOne').resolves(updatedTweet);
        sinon.stub(tweetModel, 'findByIdAndUpdate').resolves();

        await updateTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ message: 'Update tweet successfully' });
    });

    it('updateTweet function error occurs', async function() {
        sinon.stub(tweetIdSchema, 'validate').throws(new Error('Validation error'));

        await updateTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Validation error' });
    });
});
