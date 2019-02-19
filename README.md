# NEWS-API (Northcoders-KNEWS)

This project is a RESTful Application Programming Interface (API) that utilises http methodologies in order to retrieve, edit, add or delete articles, topics, comments and users from a generated news based database.

## Getting Started

Follow these instructions in order to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

In order to install and run this software locally, you will require node.js.


## Installing

1. First of all fork this project to your own repo.

2. Clone the repo remotely by executing this command:


```
git clone <Insert Github Repo Link>
```

3. Change directory to the local repo file.

4. The following dependencies are required for deployment/production:

```
body-parser: ^1.18.3
express: ^4.16.4
knex: ^0.15.2
pg: ^7.8.0
```
5. These dependencies are required for testing purposes:

```
supertest: ^3.4.2
nodemon: ^1.18.10
mocha: ^5.2.0
chai: ^4.2.0

```
6. Running the following command will install the dependencies:

```
npm install
```

## Setting up The Database

1. Create a config file in the project root directory, name it as such:

```
knexfile.js
```

2. In order to seed and migrate the database depending on the environment, see below (if using linux you will need to include psql user credentials);

```js
const ENV = process.env.NODE_ENV || 'development'; 

const baseConfig = {
  client: "pg",
  seeds: {
    directory: "./db/seeds"
  },
  migrations: {
    directory: "./db/migrations"
  }
};

const dbConfig = {
  development: {
    connection: {
      database: 'nc_news',
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
    },
  },
};

module.exports = { ...baseConfig, ...dbConfig[ENV] };
```

** You may want to gitignore this file if sensitive data is used **

3. To setup and seed the database, run:

```
npm run setup-dbs
npm run migrate:rollback
npm run migrate:latest
npm run seed
```


## Testing

There are 2 spec files for testing this project, utils.spec.js and app.spec.js.

Executing the following command will run the entire test suite:

```
npm run test
```

### API/Endpoint Testing

The app.spec.js file tests the API endpoints to make sure they all work as desired and also tests for error handling, for example:

```js
 it('GET request: returns an array of topic objects all containing the correct keys', () => request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0]).contain.keys('slug', 'description');
          expect(body.topics).to.have.length(2);
          expect(body.topics).to.be.an('array');
        }));
```

### Seeding/Utils Testing

The utils.spec.js file tests that the seeding functions work as desired for manipulation of the seeded data, for example:

```js
exports.formatTime = dataArr => dataArr.map((data) => {
  data.created_at = new Date(data.created_at).toISOString();
  return data;
});
```
## Routes

* For API routes/endpoints please reference the api-endpoints.json file.

## Deployment with Heroku

If you wish to deploy your own live version of the application follow these steps:

1. Create a Heroku account if you don't already have one.

2. Whilst in the same directory as your local repository run these commands:

```
heroku create <name of app>
git push heroku master
```
3. In your browser login into heroku, select the app and attach the add-on feature 'heroku postgres'.

4. Now you will have to make sure changes to the project/apps code in order for it to run on heroku, add the following line of code to the top of knexfile.js:

```js
const { DB_URL } = process.env;
```

5. In the same file add the below code to the dbConfig object, this allows the app to understand the enviroment it will be ran on, and to connect to the appropriate database:

```js
production: {
    connection: `${DB_URL}?ssl=true`,
  },
``` 
6. Next, you need to ensure the database gets seeded with the development data, so alter the ./db/data/index.js to look like this: 

```js
const data = { test, development , production: development};
```

7. Also you will need to alter the ./db/connection.js file to look like this:

```js
const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? { client: 'pg', connection: process.env.DATABASE_URL } : require('../knexfile');

module.exports = require('knex')(config);

```

8. Add the following scripts to the package.json (if there a start script already exists then omit this line):

```json
"scripts": {
    "start": "node listen.js",
    "seed:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex seed:run",
    "migrate:latest:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:latest",
    "migrate:rollback:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:rollback",
  }
```

9. Next, run these scripts in this exact order:

```
npm run migrate:rollback:prod
npm run migrate:latest:prod
npm run seed:prod
```

10. Lastly, commit these changes and push to heroku again:

```
git push heroku master
```

11. Now your app should be live on Heroku, run this to view it:

```
heroku open
```

12. If there any issues then debug with:

```
heroku logs --tail
```

## Built With

* [Node.js](https://nodejs.org/en/docs/) - Used As The JavaScript Runtime Engine
* [Knex](https://knexjs.org/) - Used As The SQL Query Builder 
* [Express](https://expressjs.com/en/api.html) - Used For The Web Application Framework
* [PostgreSQL](https://node-postgres.com/) - The Database
* [Heroku](https://devcenter.heroku.com/categories/nodejs-support) - Used For Live Application Deployment/Hosting

## Authors

* **[NorthCoders](https://github.com/northcoders)** - *Initial work*
* **[Oliver Wood](https://github.com/oliverwood93)** - *Author* 


