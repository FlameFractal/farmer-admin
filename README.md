# Farmer Admin

This project is a basic MERN web app that allows admin users to bulk upload, translate, store and query data.

It is deployed online at https://farmer-admin-client.herokuapp.com/.

## Table of Contents

- [Key Features](#key-features)
- [Future Improvements](#future-improvements)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Deploying to Heroku](#deploying-to-heroku)
- [API Endpoints](#api-endpoints)
  - [1. GET /farmers?offset={offset}&limit={limit}](#1-get-farmersoffsetoffsetlimitlimit)
  - [2. GET /farmers/count](#2-get-farmerscount)
  - [3. POST /farmers](#3-post-farmers)
  - [4. POST /auth/login](#4-post-authlogin)
  - [5. POST /auth/register](#5-post-authregister)
  - [6. GET /auth/me](#6-get-authme)
  - [7. GET /health](#7-get-health)
- [License](#license)

## Assumptions

- CSV Format
  - have following columns in this order: phone_number, farmer_name, state_name, district_name, village_name
  - have a header row.
  - have data in all the columns.
  - have all the data in English.
  - have unique phone_number for each farmer.
  - have row count maximum in the order of 1000s.

## Key Features

- Functional
  - Idempotent upsert of farmer data.
  - Bulk process by uploading CSV file.
  - Translation using Google Cloud Translation API.
  - Responsive webapp to view paginated data.
- Technical
  - Auth using JWT
  - Monorepo with microservice client and server
  - Overcoming Translate API's limit of 128 tokens by chunking.
  - Typescript for type safety and bug prevention.

## Future Improvements

- Functional
  - Use transliteration for better results for proper nouns.
    - Forcing `"from:en"` helps somewhat.
    - Google's Transliteration API is deprecated.
  - Validating english data against government database of cities, distrcts, villages ([OGD](https://data.gov.in/), [LGD](https://lgdirectory.gov.in/)) to catch misspelings and errors.
  - Returning CSV of records that failed to upsert.
  - Allow exporting of farmer data.
  - Allowing admin users to edit farmer data.
  - Allowing users to filter farmer data based on names, cities, etc.
  - Full text search on farmer data using Atlas Search (ElasticSearch).
  - Server side session management with Redis.
- Performance
  - Large CSV file
    - Upload CSV file from client to S3 using presigned url.
    - Async process large CSV files using worker and message queue.
    - Websocket for sucess notification.
  - API response caching based on query parameters (client, LB).
  - GZIP compression for API responses.
  - Server and database in a single VPC in a single region.
- Security
  - Use service account for Google Cloud instead of API Key.
  - Move the database in a private VPC.
  - Role based access control for admin users.
- Deployment
  - Dockerize and deploy server on AWS ECS
  - Deploy client on AWS S3 and Cloudfront CDN (Edge location caching)
  - Middlewares - logging, metrics, errors
  - Tests, CI/CD

## Tech Stack

- Typescript
- NodeJS (Express)
- ReactJS (Material UI)
- MongoDB (Atlas)
- Google Cloud (Translate API)
- Heroku
- Tooling (yarn, typescript, eslint, prettier)

## Local Setup

- Clone the repository: `git clone https://github.com/flamefractal/farmer-admin.git`.
- Install dependencies by running `yarn install` in both the client and server directories.
- Create a MongoDB cluster on Atlas (or local) and add a user with read/write access.
- Create a Google Cloud project and enable the Translate API. Create an API key.
- Create a `.env` file in the `server` directory with the following variables:
  - `API_PORT=5656`
  - `JWT_SECRET`
  - `MONGODB_CONNECTION_URI=mongodb://localhost:27017/farmer-admin`
  - `GOOGLE_TRANSLATE_API_KEY`
  - `PROCFILE=server/Procfile`
- Create a `.env` file in the `client` directory with the following variables:

  - `REACT_APP_API_BASE_URL`

- Start the server by running `yarn dev` in both the server and the client directory.
- Access the app at http://localhost:3000.

## Deploying to Heroku

### Deploying

```
git push heroku-server branch:main
git push heroku-client branch:main
heroku logs --tail --app farmer-admin-server
heroku logs --tail --app farmer-admin-client
```

### Setup

- Create a Heroku app for the server and the client. Add the buildpacks
  ```
  heroku create -region eu -a farmer-admin-server -r heroku-server
  heroku create -region eu -a farmer-admin-client -r heroku-client
  heroku buildpacks:add -a farmer-admin-server heroku/nodejs
  heroku buildpacks:add -a farmer-admin-server heroku-community/multi-procfile
  heroku buildpacks:add -a farmer-admin-client heroku/nodejs
  heroku buildpacks:add -a farmer-admin-client heroku-community/multi-procfile
  ```
  - Add the env variables to the config vars of each app, including `PROCFILE`.

We need to make sure that we can build the typescript code of server. And we can build the typescript code and the react code of the client. We also need a web server to serve the client code. Heroku flow: detect env -> postinstall -> build -> Procfile -> start

- Small changes
  - Create a `package.json` in the root with yarn workspaces mentioned.
  - Add `engines` to all the `package.json` files.
  - Commit `yarn.lock`, Heroku needs it to identify the env.
  - Add `REACT_APP_API_BASE_URL` env variable to the client code.
  - Add `PORT` env variable to the server code
- Add Procfiles to the server and client directories
  - `web: yarn workspace server start`, `web: yarn workspace client start`
  - Add `serve` package to the client code (can use simple http server or express as well)
  - Add `postinstall`, `build`, `start` scripts to the `package.json` files.

## API Endpoints

### 1. GET /farmers?offset={offset}&limit={limit}

Get a list of farmers.

- offset: Skip records. Defaults to 0.
- limit: Records per page. Defaults to 10.

Response

```
[
  {
    "phone_number": "999999999",
    "translations": {
      "en": {
        "farmer_name": "Pandey",
        "state_name": "Maharashtra",
        "district_name": "Wardha",
        "village_name": "Deoli"
      },
      "hi": {
        "farmer_name": "पांडे",
        "state_name": "महाराष्ट्र",
        "district_name": "वर्धा",
        "village_name": "देवली"
      }
    }
  },
]
```

### 2. GET /farmers/count

Get total count of farmers in the database

### 3. POST /farmers

Upload a CSV file of farmer data to be translated.

Request: Form-data with the CSV file containing the farmer data

### 4. POST /auth/login

Authenticate the user and generate a JWT token.

Request `{ "username": "admin", "password": "admin" }`

Response `{ "token": "eyJhbGciOiJ..." }`

### 5. POST /auth/register

Create a new user. Only existing admin users can create new users.

Request `{ "username": "admin", "password": "admin" }`

### 6. GET /auth/me

Get the current user's details based on JWT in Authorization header.

Response `{"username": "admin"}`

### 7. GET /health

Check the API is up and running.

## License

This project is licensed under the MIT License.
