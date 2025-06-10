const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

const usersU = require('./routes/users');
const usersT = require('./routes/tokens');
const mails = require('./routes/mails');
const blacklist = require('./routes/blacklist');
const labels = require('./routes/labels');

app.use('/api/users', usersU);
console.log('Loaded u');
app.use('/api/tokens', usersT);
console.log('Loaded tokens');
app.use('/api/mails', mails);
console.log('Loaded m');
app.use('/api/emails', mails);
console.log('Loaded e');
app.use('/api/labels', labels);
console.log('Loaded l');
app.use('/api/blacklist', blacklist);
console.log('Loaded b');
app.disable('etag');
console.log('e');

app.listen(4000, () => { 
console.log("Server running on port 4000");
});
