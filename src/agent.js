const request = require('superagent');
const Throttle = require('superagent-throttle');

/**
 * Implements function to get data from github
 * @author Tano Iannetta and Loan Lassalle
 */
class Agent {
  constructor(credentials) {
    this.credentials = credentials;
    this.repos = [];
    this.organization = [];
    this.organization.repos = [];
  }

  /**
   * Fetch and process data of an organization and its repositories
   * @param organization to look about
   * @param allDataAvailable callback function
   */
  fetchAndProcessOrganizationAndRepos(organization, allDataAvailable) {
    this.fetchAndProcessAnOrganisations(organization, (err, orga) => {
      this.organization = orga;
      if (err === 'Not Found' || !(err === null) || orga.login === undefined) {
        allDataAvailable(err, null);
      } else {
        this.fetchAndProcessReposOfAnOrganization(orga.login, (err2, repos) => {
          this.repos = repos;
          this.organization.repos = this.repos;
          allDataAvailable(null, this.organization);
        });
      }
    });
  }

  /**
   * Fetch and process languages of a list of repositories
   * @param repos to look about
   * @param allLanguagesAvailable callback function
   */
  fetchAndProcessLanguagesOfRepos(repos, allLanguagesAvailable) {
    // limit number of request by second
    const throttle = new Throttle({
      active: true,
      rate: 20,
      ratePer: 1000,
      concurrent: 10,
    });
    let currentNbrOfRequest = 0;
    const nbrOfRepos = repos.length;
    let i = 0;

    /**
     * Wait for all repositories being processed to finish
     * @param repositories repositories processed
     */
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
          repo.languages = res.body; // languages in the repo
          repositories.push(repo);
          notify(repositories);
        });
    }
  }

  /**
   * Fetch and process an organization
   * @param organization to look about
   * @param done callback function
   */
  fetchAndProcessAnOrganisations(organization, done) {
    const targetUrl = `https://api.github.com/orgs/${organization}`;

    /**
     * Fetch and process a page
     * @param pageUrl page tu fetch
     * @param credentials credentials with access token
     */
    function fetchAndProcessPage(pageUrl, credentials) {
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        // get some data of an organization
        .end((err, res) => {
          if (!(res.body.message === null) && res.body.message === 'Not Found') {
            done('Not Found', null);
          }
          const orga = {
            login: res.body.login,
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

  /**
   * Fetch and process repositories of an organization
   * @param organization
   * @param allReposAreAvailable
   */
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
