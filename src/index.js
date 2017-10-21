/**
 * This simple server listen on port 7410 to get a POST request to use the Agent and get data about
 * a given organization. The agent will store data in the given target repository.
 * The server need to have username and token in order to have right to write data on a GitHub repository
 */
const Agent = require('./agent.js');
const Storage = require('./storage');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const credentials = require('../github-credentials.json');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/agent', (request, response) => {
  const agent = new Agent(credentials);
  const targetRepo = request.query.repository;
  const organization = request.query.organization;
  if (targetRepo !== undefined && organization !== undefined) {
    agent.fetchAndProcessOrganizationAndRepos(organization, (err, data) => {
      if (!(err === null)) {
        response.end(err);
        // couldn't make requests
      } else if (err === null && data === null) {
        response.end('/invalid');
      } else {
        const storage = new Storage(credentials.username, credentials.token, targetRepo);
        storage.publish('my-data-file.json', JSON.stringify(data), 'new version of the file', () => {
          response.end('/ready');
        });
      }
    });
  } else {
    response.end('/invalid');
  }
});

app.listen(7410, () => {
  console.log('Started on PORT 7410');
});
