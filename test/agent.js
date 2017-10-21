const chai = require('chai');
const credentials = require('../github-credentials.json');
const Agent = require('../src/agent.js');

const Storage = require('../src/storage');

const should = chai.should();

/**
 * Used to test the implementation of the agent
 * @author Tano Iannetta and Loan Lassalle
 */
describe('agent', () => {
  it('should fetch an organizations', (done) => {
    const agent = new Agent(credentials);
    const orga = 'SoftEng-HEIGVD';
    agent.fetchAndProcessAnOrganisations(orga, (err, organization) => {
      should.not.exist(err);
      should.exist(organization);
      done();
    });
  });

  it('should fetch the repos of an organization', (done) => {
    const agent = new Agent(credentials);
    const orga = 'QubesOS';
    agent.fetchAndProcessReposOfAnOrganization(orga, (err, repos) => {
      should.not.exist(err);
      repos.should.be.an('array');
      done();
    });
  });

  it('should fetch data of an organization and store them on GitHub', (done) => {
    const agent = new Agent(credentials);
    const orga = 'QubesOS';
    agent.fetchAndProcessOrganizationAndRepos(orga, (err, data) => {
      should.not.exist(err);
      should.exist(data);
      const repo = 'githubAnalytic-agent';
      const storage = new Storage(credentials.username, credentials.token, repo);
      storage.publish('my-data-file.json', JSON.stringify(data), 'new version of the file', (err2, result) => {
        should.not.exist(err2);
        should.exist(result);
        done();
      });
    });
  });
});

