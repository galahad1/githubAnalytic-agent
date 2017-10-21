# TWEB :: GitHub Analytics :: Organisation
Authors: Tano Iannetta & Loan Lassalle
***

## Architecture
The GitHub analytics projects is base on a client and a agent side.

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

You will aslo need to change the target repository of the data storage. In the test/storage.js and test/agents.js files you want to change the value of `const repo = 'githubAnalytic-agent';` with one of your repository.

You can now run the following commands to run the tests of the agent

`$ npm install` to install the dependencies

`$ node_modules/mocha/bin/mocha --timeout 30000 test/agent.js ` to execute the tests of the agent

The agent routine test also check the storage on the GitHub repository part,
however you can test this part separately

`$ node_modules/mocha/bin/mocha --timeout 30000 test/storage.js` to execute the test of the storage

### Local host of the agent

You can host the agent locally.
Here again you will need the github-credentials.json file with your username and token

`$ node src/index.html` to run the application

This application is a small server that listen on port `7410`. The server is waiting a POST request with the organization you want to fetch data about and the repository where to store the data. Here's an example:

`localhost:7410/agent?organization=QubesOS&repository=githubAnalytic-agent`

The server will respond to the request with:
* `/ready` if the data were stored with success
* `/notFound` if the organization does not existe
* `/invalid` if the request didn't worked properly (the number of requests allowed by hour of the token is exceed for example).


### Deplyement on Heroku

    Prerequies: Heroku installed and initialized with your account
