const chai = require('chai');
const credentials = require('../github-credentials.json');
const Agent = require('../src/agent.js');

const should = chai.should();

describe('agent', () => {
  it('should fetch an organizations', (done) => {
    const agent = new Agent(credentials);
    const orga = 'manjaro';
    agent.fetchAndProcessAnOrganisations(orga, (err, organization) => {
      should.not.exist(err);
      should.exist(organization);
      console.log(organization);
      done();
    });
  });

  /* it('should return an error if the organization does not exist', (done) => {
    const agent = new Agent(credentials);
    const orga = 'jfkjbqwd';
    agent.fetchAndProcessAnOrganisations(orga, (err, organization) => {
      should.not.exist(err);
      should.exist(organization);
      organization.message.should.equal('Not Found');
      done();
    });
  }); */

  it('should fetch the repos of an organization', (done) => {
    const agent = new Agent(credentials);
    const orga = 'jetbrains';
    agent.fetchAndProcessReposOfAnOrganization(orga, (err, repos) => {
      should.not.exist(err);
      repos.should.be.an('array');
      console.log(repos);
      done();
    });
  });
});
