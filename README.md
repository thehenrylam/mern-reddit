# mern-boilerplate
Yet another MERN stack boilerplate

## Requirements

1. MongoDB
2. NodeJS + `npm`

## Set up and installation

### Frontend

### Backend

1. Go to the `backend` directory of the repository
2. Make keys.secret.js
3. Fill it up with this script
```
modules.export = {
    mongoURI: <mongoURI here, e.g. "mongodb://123.1.2.3:5678">\
    databaseName: <name of database that the backend will use here, e.g. "activityLog">
    secretOrKey: <key here, e.g. "NoOneWillGuessThisText!">
};
```
4. execute `mongo`
5. execute `use <name of database>` (databaseName that is written in keys.secret.js)
6. `CTRL+C` to exit out of the `mongo` client
7. 


