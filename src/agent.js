const request = require('superagent');
const Throttle = require('superagent-throttle');


// todo fonction qui attend que les deux fonctions de fetch soient finie pour regrouper les information et faire le post

/**
 * Implements function to get data from github
 * @author Tano Iannetta and Loan Lassalle
 */
class Agent {
  constructor(credentials) {
    this.credentials = credentials;
    this.repos = [];
  }
  fetchAndProcessLanguagesOfRepos(repos, allLanguagesAvailable) {
    const throttle = new Throttle({
      active: true,
      rate: 20,
      ratePer: 1000,
      concurrent: 10,
    });
    let currentNbrOfRequest = 0;
    const nbrOfRepos = repos.length;
    let i = 0;
    function notify(repositories) {
      currentNbrOfRequest += 1;
      if (currentNbrOfRequest === nbrOfRepos) {
        allLanguagesAvailable(null, repositories);
      }
    }
    const repositories = [];
    for (; i < nbrOfRepos; i += 1) {
      const repo = repos[i];
      const targetUrl = repo.languages_url;

      request
        .get(targetUrl)
        .use(throttle.plugin())
        .auth(this.credentials.username, this.credentials.token)
        .end((err, res) => {
          repo.languages = res.body;
          repositories.push(repo);
          notify(repositories);
        });
    }
  }
  fetchAndProcessAnOrganisations(organization, done) {
    const targetUrl = `https://api.github.com/orgs/${organization}`;
    function fetchAndProcessPage(pageUrl, credentials) {
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          const orga = {
            name: res.body.name,
            url: res.body.url,
            description: res.body.description,
            created_at: res.body.created_at,
            collaborators: res.body.collaborators,
          };
          done(null, orga);
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
          const repo = res.body.map(repository => ({
            name: repository.name,
            html_url: repository.html_url,
            id: repository.id,
            languages_url: repository.languages_url,
            created_at: repository.created_at,
          }));
          repos = repos.concat(repo);
          if (res.links.next) {
            fetchAndProcessPage.bind(this)(res.links.next, credentials);
          } else {
            this.fetchAndProcessLanguagesOfRepos(repos, (error, languages) => {
              this.repos = languages;
              allReposAreAvailable(error, this.repos);
            });
          }
        });
    }
    fetchAndProcessPage.bind(this)(targetUrl, this.credentials);
  }
}

module.exports = Agent;
