const request = require('superagent');

class Agent {
  constructor(credentials) {
    this.credentials = credentials;
  }

  fetchAndProcessAllOrganizations(allOrganizationsAvailable) {
    const targetUrl = 'https://api.github.com/organizations';
    let organizations = [];
    let count = 0;
    function fetchAndProcessPage(pageUrl, credentials) {
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          organizations = organizations.concat(res.body);
          if (res.links.next && count < 5) {
            fetchAndProcessPage(res.links.next, credentials);
            count += 1;
          } else {
            allOrganizationsAvailable(null, organizations);
          }
        });
    }
    fetchAndProcessPage(targetUrl, this.credentials);
  }

  fetchAndProcessAnOrganisations(organization, done) {
    const targetUrl = `https://api.github.com/orgs/${organization}`;
    let result = '';
    function fetchAndProcessPage(pageUrl, credentials) {
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          result = res.body;
          console.log(result);
          done(null, result);
        });
    }
    fetchAndProcessPage(targetUrl, this.credentials);
  }

  fetchAndProcessReposOfAnOrganization(organization, allReposAreAvailable) {
    const targetUrl = `https://api.github.com/orgs/${organization}/repos`;
    let repos = [];
    function fetchAndProcessPage(pageUrl, credentials) {
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          repos = repos.concat(res.body);
          if (res.links.next) {
            fetchAndProcessPage(res.links.next, credentials);
          } else {
            console.log(repos);
            allReposAreAvailable(null, repos);
          }
        });
    }
    fetchAndProcessPage(targetUrl, this.credentials);
  }
}

module.exports = Agent;
