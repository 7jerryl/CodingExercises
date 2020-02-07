require('dotenv').config();

const path = require('path');
const express = require('express');

const app = express();

const staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function() {
  console.log(`Listening on port ${app.get('port')}`);
});
