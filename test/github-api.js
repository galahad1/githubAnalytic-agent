const chai = require('chai');
const request = require('superagent');
const { username, token } = require('../github-credentials.json');

const should = chai.should();

describe('the Github API', () => {
  it('allow me to get a list of all organizations', (done) => {
    const url = 'https://api.github.com/organizations';
    request
      .get(url)
      .auth(username, token)
      .set('Accept', 'application/vnd.github.v3+json')
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        done();
      });
  });
});
