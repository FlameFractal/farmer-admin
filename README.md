# Farmer Admin

This project is a basic MERN web app that allows admin users to bulk upload, translate, store and query data.

## Key Features

- Translation using Google Translate API.
- Bulk process by uploading CSV file.
- View paginated data.
- Auth using JWT.

## Future Improvements

- Upload CSV file to S3 using presigned url.
- Async processing for large CSV files using message queues. Websocket for sucess notification.
- Logging, metrics, errors.
- Implement search on farmer data.

## Tech Stack

- Typescript
- NodeJS
- ReactJS
- MongoDB (Atlas)
- Google Cloud Translate
- Tooling (yarn, typescript, eslint, prettier)

## Installation

- Clone the repository: `git clone https://github.com/flamefractal/farmer-admin.git`.
- Install dependencies by running `yarn install` in both the client and server directories.
- Create a `.env` file in the `server` directory with the following variables:
  - `PORT`
  - `MONGODB_CONNECTION_URI`
  - `JWT_SECRET`
  - `GOOGLE_TRANSLATE_API_KEY`
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

### 1. GET /farmers?language={language}&offset={offset}&limit={limit}

Get a list of farmer data in a specific language.

- language: Defaults to en. Supports: hi, mr, pa, te.
- offset: The starting index. Defaults to 0.
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

### 2. POST /farmers

Upload a CSV file of farmer data to be translated.

Request: Form-data with the CSV file containing the farmer data

### 3. POST /auth/login

Authenticate the user and generate a JWT token.

Request `{ "username": "admin", "password": "password" }`
Response `{ "token": "eyJhbGciOiJ..." }`

### 4. GET /auth/me

Get the current user's details based on JWT in Authorization header.

Response `{"username": "admin"}`

### 5. GET /health

Check the health of the API.

## License

This project is licensed under the MIT License.
