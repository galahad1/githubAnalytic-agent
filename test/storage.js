const Storage = require('../src/storage');
const credentials = require('../github-credentials.json');
const should = require('chai').should();

describe('Storage', () => {
  it('should allow me to store a file on GitHub', (done) => {
    const repo = 'githubAnalytic-agent';
    const storage = new Storage(credentials.username, credentials.token, repo);
    const content = {
      random: Math.random(),
    };
    storage.publish('doc/data/organization.json', JSON.stringify(content), 'new version of the file', (err, result) => {
      should.not.exist(err);
      should.exist(result);
      done();
    });
  });
});
