const Agent = require('../src/agent.js');
const Storage = require('../src/storage');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const credentials = require('../github-credentials.json');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/agent', (request, response) => {
  const agent = new Agent(credentials);
  const targetRepo = request.query.repository;
  const organization = request.query.organization;
  agent.fetchAndProcessOrganizationAndRepos(organization, (err, data) => {
    const storage = new Storage(credentials.username, credentials.token, targetRepo);
    storage.publish('my-data-file.json', JSON.stringify(data), 'new version of the file', () => {
      response.end('Data ready');
    });
  });
});

app.listen(7410, () => {
  console.log('Started on PORT 7410');
});
