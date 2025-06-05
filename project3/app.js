const express = require('express');
const app = express();
app.use(express.json());

const usersU = require('./routes/users');
const usersT = require('./routes/tokens');
const mails = require('./routes/mails');
const blacklist = require('./routes/blacklist');
const labels = require('./routes/labels');

app.use('/api/users', usersU);
app.use('/api/tokens', usersT);
app.use('/api/mails', mails);
app.use('/api/emails', mails);
app.use('/api/labels', labels);
app.use('/api/blacklist', blacklist);
app.disable('etag');

app.listen(4000, () => { 
    console.log();
});
