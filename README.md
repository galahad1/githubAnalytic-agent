# TWEB :: GitHub Analytics :: Organization
Authors: Tano Iannetta & Loan Lassalle
***

## Architecture
The GitHub analytics projects is based on a client and a agent side.

### Client
The client side of the project is hosted directly on github via GitHub Pages. You can consult the [website](https://lassalleloan.github.io/githubAnalytic-static/ "GitHub Analytics Static").

### Agent
In the background, an agent working to publish updated data on GitHub for the client. The agent's code is available [here](https://github.com/galahad1/githubAnalytic-agent "GitHub Analytics Agent").
The agent is deployed in the cloud on [Heroku](https://www.heroku.com/ "Heroku Website"). Read the repo's [README](https://github.com/heroku/heroku-repo "Heroku Repo") to know more about it.

### Local test of the Agent

You can test the agent locally.

First of all you have to create a file named github-credentials.json that contains your username and your token that allow you to make requests to the github API and also allow you to write on a repository.

    {
    		"username" : "yourUsername",
    		"token" : "yourToken"
    }

You will also need to change the target repository of the data storage. In the test/storage.js and test/agents.js files you want to change the value of `const repo = 'githubAnalytic-agent';` with one of your repository.

You can now run the following commands to run the tests of the agent

`$ npm install` to install the dependencies

`$ node_modules/mocha/bin/mocha --timeout 30000 test/agent.js ` to execute the tests of the agent

The agent routine test also check the storage on the GitHub repository part,
however you can test this part separately

`$ node_modules/mocha/bin/mocha --timeout 30000 test/storage.js` to execute the test of the storage

### Local hosting of the agent

You can host the agent locally.
Here again you will need the github-credentials.json file with your username and token

`$ node src/index.js` to run the application

This application is a small server that listen on port `7410` (if deployed locally). The server is waiting a GET request with the organization you want to fetch data about and the repository where to store the data. Here's an example:

`localhost:7410/agent?organization=QubesOS&repository=githubAnalytic-agent`

The server will respond to the request with:
* `/ready` if the data were stored with success
* `/notFound` if the organization does not exist
* `/invalid` if the request didn't worked properly (the number of requests allowed by hour of the token is exceed for example).


### Preparation of Deployment on Heroku

__Prerequisites:__
* Heroku installed and initialized with your account
* Logged in with Heroku

#### Prepare the application

`$ git clone https://github.com/galahad1/githubAnalytic-agent.git`

`$ cd githubAnalytic-agent`

### Deployment

`$ heroku create` to create the heroku application

>You have to set environment variables with your credentials

>`$ heroku config:set GITHUB_USERNAME=yourUsername`

>`$ heroku config:set GITHUB_TOKEN=yourToken`

Now deploy the app

`$ git push heroku master`

You can now go to the application web page

`$ heroku open`

You will land on the index page that give you indications on how to use the agent.
To activate the agent make a GET request on the /agent page

`https://infinite-earth-87590.herokuapp.com/agent?organization=QubesOs&repository=githubAnalytic-agent`
