const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { deleteTweet } = require('../src/controllers/tweetController.js');
const { tweetIdSchema } = require('../src/validations/tweetValidate.js');
const tweetModel = require('../src/model/tweetModel.js');

chai.use(sinonChai);
const { expect } = chai;

describe('deleteTweet function', function() {
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

    it('deleteTweet function validation for tweet ID fails', async function() {
        req.params = { tweetId: 'invalidtweetid' };

        await deleteTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWithMatch({ message: '"tweetId" must only contain hexadecimal characters' });
    });

    it('deleteTweet function if error occurs', async function() {
        sinon.stub(tweetIdSchema, 'validate').throws(new Error('Validation error'));

        await deleteTweet(req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Validation error' });
    });
});
