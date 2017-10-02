const chai = require('chai');
const credentials = require('../github-credentials.json');
const Agent = require('../src/agent.js');

const should = chai.should();

describe('agent', () => {
  it('should fetch organizations', (done) => {
    const agent = new Agent(credentials);
    agent.fetchAndProcessAllOrganizations((err, organizations) => {
      should.not.exist(err);
      organizations.should.be.an('array');
      done();
    });
  });
});
