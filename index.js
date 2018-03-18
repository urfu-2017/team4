'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const publicDir = path.join(__dirname, 'build');
const indexFile = path.resolve(publicDir, 'index.html');

app.use(cors());
app.use(express.static(publicDir));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(indexFile);
});

app.listen(8080, () => {
    console.info('Backend api started at http://localhost:8080');
});
