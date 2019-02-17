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


## Running the tests

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

## Built With

* [Node.js](https://nodejs.org/en/docs/) - Used As The JavaScript Runtime Engine
* [Knex](https://knexjs.org/) - Used As The SQL Query Builder 
* [Express](https://expressjs.com/en/api.html) - Used For The Web Application Framework
* [PostgreSQL](https://node-postgres.com/) - The Database

## Authors

* **[NorthCoders](https://github.com/northcoders)** - *Initial work*
* **[Oliver Wood](https://github.com/oliverwood93)** - *Author* 


