const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { getTweetsFeed } = require('../src/controllers/tweetController.js');
const userModel = require('../src/model/userModel.js');
const tweetModel = require('../src/model/tweetModel.js');

chai.use(sinonChai);
const { expect } = chai;

describe('getTweetsFeed function', function() {
    let req, res, next;

    beforeEach(function() {
        req = { body: { user: 'validuserid' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(function() {
        sinon.restore();
    });

    it('getTweetsFeed function error occurs', async function() {
        sinon.stub(userModel, 'findById').throws(new Error('Database error'));

        await getTweetsFeed(req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Database error' });
    });
});
