Tech Stack

- Typescript
- NodeJS (Express)
- ReactJS (Material UI)
- MongoDB (Atlas)

Future improvements

- S3 upload
- Websocket for progress notification
- Logging, metrics, error messages

Not necessary

- GraphQL

├── client/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── models/ # Typescript types for data models
│ │ ├── services/ # API service classes
│ │ ├── views/ # React views
│ │ └── index.tsx # React app entry point
│ ├── public/
│ │ ├── index.html # HTML template
│ │ └── ...
│ └── ...

steps

- database schema design
- scaffold react and node projects
  - setup tooling (yarn, typescript, eslint, mui)
  - create and connect to db
  - create feature branch
- api 1
  - chunking csv to translate api
  - wait for result? add to queue?
- api 2
- web page 1, 2
  - styling
- authentication
-

Write tests for your application using a testing framework like Jest. You can use Jest to write unit tests for your API endpoints, and to write integration tests for your client-side components.

Set up a deployment and CI pipeline for your application using GitHub Actions. You can use GitHub Actions to automatically run your tests and lint your code every time you push a commit to GitHub, build and deploy your application to a cloud provider like Heroku or Netlify
