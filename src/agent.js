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
}

module.exports = Agent;
